import Sidebar from "../components/sidebar/Sidebar";
import getConversations from "../services/getConversations";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({children}:{ children:React.ReactNode}) {
    const conversations = await getConversations()
    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList initalItems={conversations} />
                {children}
            </div>
        </Sidebar>
    )
}