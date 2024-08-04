import { gql, useMutation } from "@apollo/client";

const REGISTER_MUTATION = gql`
  mutation Register(
    $name: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      name: $name
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export function useAuth() {
  const [register] = useMutation(REGISTER_MUTATION);
  const [login] = useMutation(LOGIN_MUTATION);

  return { register, login };
}
