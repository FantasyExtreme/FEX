export const idlFactory = ({ IDL }) => {
  const IUser = IDL.Record({ 'name' : IDL.Text, 'email' : IDL.Text });
  const Role = IDL.Variant({ 'admin' : IDL.Null, 'user' : IDL.Null });
  const User = IDL.Record({
    'name' : IDL.Text,
    'role' : Role,
    'joiningDate' : IDL.Int,
    'email' : IDL.Text,
  });
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Opt(User)),
    'err' : IDL.Text,
  });
  const Key = IDL.Text;
  const User__1 = IDL.Record({
    'name' : IDL.Text,
    'role' : Role,
    'joiningDate' : IDL.Int,
    'email' : IDL.Text,
  });
  const Users = IDL.Vec(IDL.Tuple(Key, User__1));
  const _anon_class_17_1 = IDL.Service({
    'addUser' : IDL.Func([IUser], [Result], []),
    'getAdmins' : IDL.Func([], [Users], ['query']),
    'getUser' : IDL.Func([IDL.Opt(IDL.Text)], [IDL.Opt(User)], ['query']),
    'makeAdmin' : IDL.Func([IDL.Principal], [IDL.Bool], []),
  });
  return _anon_class_17_1;
};
export const init = ({ IDL }) => {
  return [];
};
