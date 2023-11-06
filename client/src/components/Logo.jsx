import ChatRoundedIcon from "@mui/icons-material/ChatRounded";

const Logo = () => {
  return (
    <div className="text-cyan-600 font-bold flex items-center gap-2 p-4">
      <span>
        <ChatRoundedIcon />
      </span>
      <span>MernChat</span>
    </div>
  );
};

export default Logo;
