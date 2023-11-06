/* eslint-disable react-hooks/exhaustive-deps */
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useContext, useEffect, useRef, useState } from "react";
import Logo from "../components/Logo";
import { UserContext } from "../components/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import { BASE_AUTH_URL, VITE_BASE_MESSAGE_URL } from "../api";
import toast from "react-hot-toast";
import OnlinePeople from "../components/OnlinePeople";
import OfflinePeople from "../components/OfflinePeople";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [offlinePeople, setOfflinePeople] = useState([]);
  const divUnderMessages = useRef();
  const { userData } = useContext(UserContext);

  const connectToWs = () => {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", (event) => {
      if (event.code === 1006) {
        console.log("Connection closed unexpectedly. Reconnecting...");
        connectToWs();
      } else {
        console.error("Connection closed with an error:", event.reason);
      }
    });
  };

  useEffect(() => {
    connectToWs();
  }, []);

  const showOnlinePeople = (peopleArray) => {
    setOnlinePeople(peopleArray);
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_AUTH_URL}/get-online-people`);
        const onlinePeopleIds = onlinePeople.map((person) => person._id);
        const offlinePeople = response.data.filter(
          (user) => !onlinePeopleIds.includes(user._id)
        );
        setOfflinePeople(offlinePeople);
      } catch (error) {
        console.error("Error fetching online people:", error);
      }
    }
    fetchData();
  }, [onlinePeople]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedUsersId) {
        try {
          const response = await axios.get(
            `${VITE_BASE_MESSAGE_URL}/get-all/${selectedUsersId}`
          );
          const { data } = response;
          setMessages(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [selectedUsersId]);

  const onlinePeopleExcludeOurUser = onlinePeople.filter(
    (p) => p._id !== userData.user._id
  );

  const sendMessage = (e, file = null) => {
    if (e) e.preventDefault();
    // if (newMessageText.trim() === "" || !file === null) {
    //   return toast.error("Please Provide Somthing", {
    //     duration: 3000,
    //   });
    // }
    ws.send(
      JSON.stringify({
        recipient: selectedUsersId,
        text: newMessageText,
        file,
      })
    );
    setNewMessageText("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: userData.user._id,
        recipient: selectedUsersId,
        _id: Date.now(),
      },
    ]);
    if (file) {
      axios
        .get(`${VITE_BASE_MESSAGE_URL}/get-all/${selectedUsersId}`)
        .then((res) => {
          setMessages(res.data);
        });
    }
  };

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const messagesWithoutDupes = uniqBy(messages, "_id");

  const handleLogout = async () => {
    const response = await axios.get(`${BASE_AUTH_URL}/logout`);
    if (response.status === 200) {
      window.location.reload();
      toast.success("Logout Successful");
      setWs(null);
    } else {
      toast.error("Logout Failed");
    }
  };

  const sendFile = (ev) => {
    ev.preventDefault();
    const file = ev.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        sendMessage(null, {
          name: file.name,
          data: reader.result.split(",")[1],
        });
      };
    }
  };

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />
          {onlinePeopleExcludeOurUser.map((person, index) => (
            <OnlinePeople
              online={true}
              key={index}
              person={person}
              index={index}
              selectedUsersId={selectedUsersId}
              setSelectedUsersId={setSelectedUsersId}
            />
          ))}
          <OfflinePeople
            offline={false}
            selectedUsersId={selectedUsersId}
            setSelectedUsersId={setSelectedUsersId}
            offlinePeople={offlinePeople}
          />
        </div>
        <div className="p-2 text-center flex items-center gap-2 justify-center">
          <img
            src={userData.user.image}
            alt={userData.user.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold text-lg">{userData.user.name}</span>

          <button
            className="p-2 bg-cyan-600 text-white rounded-xl"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-col w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUsersId && (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-600 text-xl">
                &larr; Selected Person
              </span>
            </div>
          )}
          {!!selectedUsersId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithoutDupes.map((message) => {
                  return (
                    <div
                      key={message._id}
                      className={`${
                        message.sender === userData.user._id
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      <div
                        className={`text-left inline-block p-2 my-2 rounded-sm text-sm ${
                          message.sender === userData.user._id
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-500"
                        }`}
                      >
                        {message.text}
                        {message.file && (
                          <div className="flex items-center gap-1">
                            <AttachFileRoundedIcon />
                            <a
                              href={`https://mern-chat-app-1-server.vercel.app/uploads/${message.file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              View File
                            </a>
                          </div>
                        )}
                        <div className="text-xs text-black mt-1">
                          Sent at:
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>
        {!!selectedUsersId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              type="text"
              placeholder="Type Here"
              className="bg-white flex-grow border p-2 rounded-sm"
            />
            <label
              type="button"
              className=" cursor-pointer bg-grat-200 p-2 text-white bg-cyan-500 rounded-sm border border-gray-600"
            >
              <AttachFileRoundedIcon />
              <input type="file" className="hidden" onChange={sendFile} />
            </label>
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded-sm"
            >
              <SendRoundedIcon />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
