import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Item from "../../interfaces/ItemI";
import {
  addAttack,
  addDefense,
  addHealth,
  addQi,
  removeItem,
  openGeodes,
  equipItem,
  addMoney,
  consumeItems,
} from "../../state/reducers/characterSlice";
import { GEODE_ITEM_ID } from "../../constants/gems";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import "./InventoryItem.css";

interface InventoryItemProps {
  item: Item;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const canUse =
    item.effect && item.value != null && ["attack", "defense", "vitality", "qi"].includes(item.effect);
  const isGeode = item.id === GEODE_ITEM_ID;
  const canEquip = !!item.equipmentSlot && ["sword", "helmet", "body", "shoes", "legs", "ring", "amulet", "qiTechnique", "combatTechnique"].includes(item.equipmentSlot);
  const canSell = typeof item.price === "number" && item.price > 0;
  const qty = item.quantity ?? 1;

  function handleEquip() {
    if (!canEquip) return;
    dispatch(equipItem({ slot: item.equipmentSlot as EquipmentSlot, item }));
    setMenuOpen(false);
  }

  function handleSellOne() {
    if (!canSell) return;
    dispatch(removeItem(item));
    dispatch(addMoney(item.price!));
    setMenuOpen(false);
  }

  function handleSellAll() {
    if (!canSell || qty <= 0) return;
    dispatch(consumeItems([{ itemId: item.id, amount: qty }]));
    dispatch(addMoney(item.price! * qty));
    setMenuOpen(false);
  }

  function handleDiscardOne() {
    dispatch(removeItem(item));
    setMenuOpen(false);
  }

  function handleDiscardAll() {
    if (qty <= 0) return;
    dispatch(consumeItems([{ itemId: item.id, amount: qty }]));
    setMenuOpen(false);
  }

  function useItem() {
    if (!canUse) return;
    dispatch(removeItem(item));
    if (item.effect === "attack" && item.value != null) dispatch(addAttack(item.value));
    if (item.effect === "defense" && item.value != null) dispatch(addDefense(item.value));
    if (item.effect === "vitality" && item.value != null) dispatch(addHealth(item.value));
    if (item.effect === "qi" && item.value != null) dispatch(addQi(item.value));
    setMenuOpen(false);
  }

  function useGeode(amount: number) {
    if (!isGeode || amount <= 0) return;
    dispatch(openGeodes(amount));
    setMenuOpen(false);
  }

  return (
    <div
      className="inventoryItem__main"
      title={item.description}
      onClick={() => setMenuOpen((o) => !o)}
    >
      <div className="inventoryItem__icon-wrap">
        {item.picture ? (
          <img src={item.picture} alt="" className="inventoryItem__icon" />
        ) : (
          <div className="inventoryItem__icon inventoryItem__icon--placeholder">?</div>
        )}
      </div>
      <span className="inventoryItem__name">{item.name}</span>
      <span className="inventoryItem__amount">×{item.quantity ?? 1}</span>
      <div className="inventoryItem__tooltip" role="tooltip">
        {item.description}
      </div>
      {menuOpen && (
        <>
          <div
            className="inventoryItem__backdrop"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
            }}
            aria-hidden
          />
          <div className="inventoryItem__menu" onClick={(e) => e.stopPropagation()}>
            {isGeode && (
              <>
                <button type="button" className="inventoryItem__menu-btn" onClick={() => useGeode(1)}>
                  Use 1
                </button>
                {(item.quantity ?? 1) > 1 && (
                  <button type="button" className="inventoryItem__menu-btn" onClick={() => useGeode(item.quantity ?? 1)}>
                    Use all
                  </button>
                )}
              </>
            )}
            {canUse && !isGeode && (
              <button type="button" className="inventoryItem__menu-btn" onClick={useItem}>
                Use
              </button>
            )}
            {canEquip && (
              <button type="button" className="inventoryItem__menu-btn" onClick={handleEquip}>
                Equip
              </button>
            )}
            {canSell && (
              <>
                <button type="button" className="inventoryItem__menu-btn" onClick={handleSellOne}>
                  Sell 1 ({item.price} spirit stones)
                </button>
                {qty > 1 && (
                  <button type="button" className="inventoryItem__menu-btn" onClick={handleSellAll}>
                    Sell all ({item.price! * qty} spirit stones)
                  </button>
                )}
              </>
            )}
            <button type="button" className="inventoryItem__menu-btn" onClick={handleDiscardOne}>
              Discard 1
            </button>
            {qty > 1 && (
              <button type="button" className="inventoryItem__menu-btn" onClick={handleDiscardAll}>
                Discard all
              </button>
            )}
            <button
              type="button"
              className="inventoryItem__menu-btn"
              onClick={() => setMenuOpen(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryItem;
