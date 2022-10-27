import Post from '../../models/posts';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

const { ObjectId } = mongoose.Types;

const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};


export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;

  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }

  return next();
};

export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
    const post = await Post.findById(id);
    // 포스트가 존재하지 않을 때
    if (!post) {
      ctx.status = 404; //  Not Found
      return;
    }
    ctx.state.post = post;

    return next();
  } catch (error) {
    ctx.throw(500, error);
  }
};

/* 포스트 작성
 POST /api/posts
 {
    title: '제목',
    body: '내용',
    tags: ['태그1', '태그2']
}
 */
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400; // bad request
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body: sanitizeHtml(body, sanitizeOption),
    tags,
    user: ctx.state.user,
  });

  try {
    await post.save();
    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};

// html을 제거하고 내용이 너무 길면 200자로 제한하는 함수
const removeHtmlAndShorten = body => {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });

  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
}

/* 포스트 목록 조회
 GET /api/posts
 */
export const list = async (ctx) => {
  // query는 문자열이기 때문에 숫자로 변환
  // 값이 없다면 1을 기본으로 설정
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  // tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();

    const postCount = await Post.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));

    ctx.body = posts.map((post) => ({
      ...post,
      body: removeHtmlAndShorten(post.body),
    }));
  } catch (error) {
    ctx.throw(500, error);
  }
};

/* 특정 포스트 조회
GET /api/posts/:id
 */
export const read = (ctx) => {
  ctx.body = ctx.state.post;
};

/* 특정 포스트 제거
DELETE /api/posts/:id
 */
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공하기는 했지만 응답할 데이터는 없음)
  } catch (error) {
    ctx.throw(500, error);
  }
};

/* 포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{ title, body }
 */
export const update = async (ctx) => {
  const schema = Joi.object().keys({
    // write에서 사용한 schema와 비슷한데, required 가 없음
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { id } = ctx.params;

  const nextData = { ...ctx.request.body }; // 객체 복사
  // body 값이 주어졌으면 HTML 필터
  if (nextData.body) {
    nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
  }

  try {
    const post = await Post.findByIdAndUpdate(
      id, 
      nextData,
       {
          new: true, // 이 값을 설정하면 업데이트 된 데이터를 반환합니다.
          // false일 때는 업데이트 되기 전의 데이터를 반환
      });

    if (!post) {
      ctx.status = 404;
      return;
    }

    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};
