import { useState } from "react";
import "./App.css";
import Alert from "@mui/material/Alert";
import User from "./assets/components/User";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
//gql is a JavaScript template literal tag used to write and parse GraphQL queries, mutations, subscriptions, and fragments.
const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      age
      name
      isMarried
    }
  }
`; //Line 17,passing arguments to Apollo Client; Line 19 passing argument to the getUserById function ! means required variables,not null
const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;
//getUserById defines an input, calls a resolver, and select output field
//calls getUserById(id), only returns id，age,name, isMarried
const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      id
      name
      age
      isMarried
    }
  }
`;
//Resolver returns data object.
// GraphQL query decides visible fields.
// Client receives exactly those selected fields.
//$ means graphQL variable, a placeholder value pass at
const UPDATE_USER_BY_ID = gql`
  mutation UpdateUser($id: ID!, $name:String, $age: Int, $isMarried: Boolean) {
    updateUserById(id:$id, name: $name, age: $age, isMarried: $isMarried) {
      id
      name
      age
      isMarried
    }
  }
`;
type User = {
id: string;
name: string;
age: number;
isMarried: boolean;
};
type UserPatch = {
  name?: string;
  age?: number;
  isMarried?: boolean;
};
type GetUsersData = {
getUsers: User[];
};

type UpdateUserByIdData = {
updateUserById: User | null;
};

type UpdateUserByIdVars = {
id: string;
name?: string;
age?: number;
isMarried?: boolean;
};
function App() {
  const [choseId, setChoseId] = useState<string>("");
  const [newUserName, setNewUserName] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const { data, error, loading } = useQuery(GET_USERS);
  const { data: userData, error: userError } = useQuery(GET_USER_BY_ID, {
    variables: { id: choseId },
    skip: !choseId.trim(),
  });
  // console.log("userData", userData);
  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleAddUser = async () => {
    console.log("newUserName", newUserName);
    console.log("age", age);
    createUser({
      variables: { name: newUserName, age: Number(age), isMarried: false },
    });
  };
  const [updateUserById] = useMutation<UpdateUserByIdData,UpdateUserByIdVars>(UPDATE_USER_BY_ID, {
    update(cache, { data: cacheData }) {
      const updated = cacheData?.updateUserById;
      if (!updated) return;
      const existingData = cache.readQuery<GetUsersData>({ query: GET_USERS });
      if (!existingData?.getUsers) return;
      cache.writeQuery({
        query: GET_USERS,
        data: {
          getUsers: existingData.getUsers.map((user) =>
            user.id === updated.id ? updated : user,
          ),
        },
      });
    },
  });
  const handleUpdateUser = async (id: string, patch:UserPatch) => {
    console.log("patch", patch);
    updateUserById({
      variables: {id, ...patch},
    });
  };
//UpdateUserByIdData is response shape from the server, comes back in result.data
//UpdateUserByIdVars is input shape send to server
// Reads current users from Apollo cache.
// Replaces only the user with matching id.
// Writes updated users list back to GET_USERS cache.
  if (loading) return <p>Data Loading</p>;
  if (error || userError)
    return (
      <Alert severity="error">
        {typeof error === "string" ? error : "unkown error"}
      </Alert>
    );
  return (
    <>
      <section id="center">
        <div className="ticks">
          <input
            type="text"
            placeholder="Name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewUserName(e.target.value)
            }
          />
          <input
            type="number"
            placeholder="age"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAge(Number(e.target.value))
            }
          />
          <button type="button" className="counter" onClick={handleAddUser}>
            Add new User
          </button>
        </div>
        <div>
          <h1>Chosen user</h1>
          <input
            type="text"
            placeholder="Enter an id"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setChoseId(e.target.value)
            }
          />
          <p>
            chosen user by id:{" "}
            {userData?.getUserById?.name
              ? userData?.getUserById?.name
              : "No matched user"}
          </p>
        </div>
        <h1>All users</h1>
        <div>
          {data?.getUsers?.map((user) => (
            <User user={user} key={user.id} onSaveButton={handleUpdateUser}/>
          ))}
        </div>
      </section>

      <section id="spacer"></section>
    </>
  );
}

export default App;
