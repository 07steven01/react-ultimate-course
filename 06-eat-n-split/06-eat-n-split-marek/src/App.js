import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isFormAddFriendVisible, setFormAddFriendVisible] = useState(false);

  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleAddFriend = function (friend) {
    setFriends((fs) => [...fs, friend]);
    setFormAddFriendVisible(false);
  };

  const handleSelected = function (friend) {
    console.log(friend);
    setSelectedFriend(friend);
    setFormAddFriendVisible(false);
  };

  const handleShowAddFriend = function () {
    setFormAddFriendVisible(!isFormAddFriendVisible);
    if (!isFormAddFriendVisible) {
      setSelectedFriend(null);
    }
  };

  const handleSplitBill = function (friend, newBalance) {
    const updatedFriends = friends.map((obj) =>
      friend.id === obj.id ? { ...friend, balance: newBalance } : obj
    );
    setFriends(updatedFriends);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelected={(friend) => handleSelected(friend)}
        />
        {isFormAddFriendVisible && (
          <FormAddFriend onAddClick={handleAddFriend} />
        )}
        <Button onClick={() => handleShowAddFriend()}>
          {isFormAddFriendVisible ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          key={selectedFriend.id}
          friend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelected, selectedFriend }) {
  return (
    <ul>
      {friends.map((f) => (
        <Friend
          key={f.id}
          onSelected={onSelected}
          friend={f}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelected, selectedFriend }) {
  const { name, balance, image } = friend;
  const isSelected = friend.id === selectedFriend?.id;

  function getBalanceText() {
    const youOwe = `You owe ${name}`;
    const owesYou = `${name} owes you`;
    const even = `You are even`;
    let whoOwesWho;
    if (balance > 0) whoOwesWho = owesYou;
    else if (balance < 0) whoOwesWho = youOwe;
    else return even;
    return `${whoOwesWho} ${Math.abs(balance)}$`;
  }

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={image} alt="avatar" />
      <h3>{name}</h3>
      <p className={balance > 0 ? "green" : balance < 0 ? "red" : ""}>
        {getBalanceText()}
      </p>
      <Button
        onClick={(f) => {
          isSelected ? onSelected(null) : onSelected(friend);
        }}
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddClick }) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const friend = {
      id: crypto.randomUUID(),
      name: name,
      image: imageUrl,
      balance: 0,
    };

    console.log(friend);
    setName("");
    setImageUrl("");
    onAddClick(friend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯‍♂️ Friend name</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <label>🎆 Image URL</label>
      <input
        type="text"
        onChange={(e) => setImageUrl(e.target.value)}
        value={imageUrl}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  const [billValue, setBillValue] = useState(0);
  const [yourExpense, setYourExpense] = useState(0);
  const [youOrTheyPay, setYouOrTheyPay] = useState(true);

  const theirExpense = billValue - yourExpense;
  const diff = youOrTheyPay ? theirExpense : yourExpense;

  const handleSubmit = function (e) {
    e.preventDefault();
    onSplitBill(friend, friend.balance + diff);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {friend.name}</h2>
      <LabeledTextInput
        value={billValue ? billValue : ""}
        onChange={(v) => setBillValue(Number(v))}
      >
        💰 Bill value
      </LabeledTextInput>
      <LabeledTextInput
        value={yourExpense ? yourExpense : ""}
        onChange={(v) => setYourExpense(Number(v))}
      >
        🧍‍♀️ Your expense
      </LabeledTextInput>
      <LabeledTextInput value={theirExpense} disabled={true}>
        👯 {friend.name}'s expense
      </LabeledTextInput>
      <label>🤑 Who is paying the bill?</label>
      <select
        onChange={(e) => {
          const booleanVal = e.target.value === "true";
          console.log(booleanVal);
          setYouOrTheyPay(booleanVal);
        }}
        value={youOrTheyPay}
      >
        <option value={true}>You</option>
        <option value={false}>{friend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

function LabeledTextInput({ value, disabled, onChange, children }) {
  return (
    <>
      <label>{children}</label>
      <input
        type="text"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
}
