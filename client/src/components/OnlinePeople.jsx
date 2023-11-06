const OnlinePeople = ({ person, selectedUsersId, setSelectedUsersId, online }) => {

  return (
    <div
      onClick={() => setSelectedUsersId(person._id)}
      className={`border-b border-gray-100 flex items-center gap-2 cursor-pointer p-4 ${
        person._id === selectedUsersId ? "bg-cyan-500 rounded-sm" : ""
      }`}
    >
      {person._id === selectedUsersId && (
        <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
      )}
      <div className="flex items-center gap-2 pl-4">
        <div className="relative">
          {online && (
            <span className="p-1 rounded-full bg-cyan-400 absolute top-7 left-7"></span>
          )}
          <img
            src={person.image}
            alt={person.email}
            className="w-9 h-9 rounded-full"
          />
        </div>

        <span>{person.name}</span>
      </div>
    </div>
  );
};

export default OnlinePeople;
