import Sidebar from "../components/sidebar/Sidebar";
import getUsers from "../services/getUsers";
import UserList from "./components/UserList";

 async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers()
  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
        {children}</div>
    </Sidebar>
  );
}
UsersLayout.getInitialProps = async () => {
  const users = await getUsers();
  return { users };
};

export default UsersLayout