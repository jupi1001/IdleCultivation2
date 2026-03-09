import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GEODE_ITEM_ID } from "../../constants/gems";
import Item, { getConsumableEffect, getEquipmentSlot } from "../../interfaces/ItemI";
import {
  addAttack,
  addDefense,
  addHealth,
  addQi,
  addMoney,
} from "../../state/reducers/characterCoreSlice";
import { equipItem, unequipItem } from "../../state/reducers/equipmentSlice";
import { removeItem, openGeodes, consumeItems, addItemById } from "../../state/reducers/inventorySlice";
import { selectEquipment } from "../../state/selectors/characterSelectors";
import "./InventoryItem.css";

interface InventoryItemProps {
  item: Item;
}

const InventoryItem: React.FC<InventoryItemProps> = React.memo(({ item }) => {
  const dispatch = useDispatch();
  const equipment = useSelector(selectEquipment);
  const [menuOpen, setMenuOpen] = useState(false);

  const canUse = getConsumableEffect(item) != null;
  const isGeode = item.id === GEODE_ITEM_ID;
  const equipmentSlot = getEquipmentSlot(item);
  const canEquip = equipmentSlot != null && ["sword", "helmet", "body", "shoes", "legs", "ring", "amulet", "qiTechnique", "combatTechnique"].includes(equipmentSlot);
  const canSell = typeof item.price === "number" && item.price > 0;
  const qty = item.quantity ?? 1;

  function handleEquip() {
    if (!canEquip || !equipmentSlot) return;
    const current = equipment[equipmentSlot];
    if (current) {
      dispatch(addItemById({ itemId: current.id, amount: 1 }));
      dispatch(unequipItem(equipmentSlot));
    }
    dispatch(consumeItems([{ itemId: item.id, amount: 1 }]));
    dispatch(equipItem({ slot: equipmentSlot, item }));
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
    const effect = getConsumableEffect(item);
    if (!effect) return;
    dispatch(removeItem(item));
    switch (effect.type) {
      case "grantAttack":
        dispatch(addAttack(effect.amount));
        break;
      case "grantDefense":
        dispatch(addDefense(effect.amount));
        break;
      case "healVitality":
        dispatch(addHealth(effect.amount));
        break;
      case "grantQi":
        dispatch(addQi(effect.amount));
        break;
      default:
        break;
    }
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
});

export default InventoryItem;
