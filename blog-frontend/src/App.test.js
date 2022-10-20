
import LoginPage from './pages/LoginPage';
import { sut_login_function_stub } from './test/sut_function_stub';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

test('sut_render_loginpage_authform', () => {

  const acutual = LoginPage();
  const expected = sut_login_function_stub();

  expect(expected).toStrictEqual(acutual);


})