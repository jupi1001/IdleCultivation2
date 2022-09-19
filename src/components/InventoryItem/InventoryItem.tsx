import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Item from "../../interfaces/ItemI";
import Modal from "react-modal";
import "./InventoryItem.css";
import { addAttack, addDefense, removeItem } from "../../state/reducers/characterSlice";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

interface InventoryItemProps {
  item: Item;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  function useItem() {
    if (!item.value) {
      console.log("Wrong data");
      return;
    }
    //Doesn't work. Huh? Works in shopitem
    //item.quantity--;
    dispatch(removeItem(item));
    if (item.effect === "attack") {
      dispatch(addAttack(item.value));
    }
    if (item.effect === "defense") {
      dispatch(addDefense(item.value));
    }
  }

  return (
    <div className="inventoryItem__main">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p>{item.quantity}</p>
      <button onClick={() => setIsOpen(true)}>open</button>
      <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel="item dialog" style={customStyles}>
        <div className="inventoryItem__main-modal">
          <h3>{item.name}</h3>
          {item.effect && <button onClick={useItem}>Use Object</button>}
          <button onClick={toggleModal}>Close modal</button>
        </div>
      </Modal>
    </div>
  );
};

export default InventoryItem;
