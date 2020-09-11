import {loginUser, logoutUser, registerUser} from '../../src/dao/userDAO';
import {clearDB} from '../helpers';
import {expect} from 'chai';

describe('USER AUTHENTICATION', () => {
  const userData = {
    email: 'user@mail.io',
    password: '123456'
  };
  let userId: string;
  before(async () => {
    await clearDB();
  });
  it('should register the user', async () => {
    const res = await registerUser(userData);
    expect(res).to.have.any.keys(['errors', 'token']);
    userId = res.token.userId;
  });
  it('should logout the current user', async () => {
    const res = await logoutUser({id: userId});
    expect(res).to.equal(true);
  });
  it('should login the user', async () => {
    const res = await loginUser(userData);
    expect(res).to.have.any.keys(['errors', 'token']);
  });
});
