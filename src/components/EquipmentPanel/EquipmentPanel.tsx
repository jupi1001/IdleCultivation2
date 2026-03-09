import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { equipItem, unequipItem } from "../../state/reducers/equipmentSlice";
import { addItemById, consumeItems } from "../../state/reducers/inventorySlice";
import { selectEquipment, selectItems } from "../../state/selectors/characterSelectors";
import { ALL_EQUIPMENT_SLOTS, EQUIPMENT_SLOT_LABELS } from "../../types/EquipmentSlot";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import { formatItemStats } from "../../utils/itemTooltipUtils";
import { Tooltip } from "../Tooltip/Tooltip";
import "./EquipmentPanel.css";

export const EquipmentPanel = () => {
  const dispatch = useDispatch();
  const equipment = useSelector(selectEquipment);
  const items = useSelector(selectItems);

  const itemsForSlot = (slot: EquipmentSlot) =>
    items.filter((i) => i.equipmentSlot === slot);

  return (
    <div className="equipment-panel">
      {ALL_EQUIPMENT_SLOTS.map((slot) => {
        const equipped = equipment[slot];
        const available = itemsForSlot(slot);
        return (
          <div key={slot} className="equipment-panel__row">
            <span className="equipment-panel__label">{EQUIPMENT_SLOT_LABELS[slot]}</span>
            <div className="equipment-panel__slot">
              {equipped ? (
                <>
                  <Tooltip content={formatItemStats(equipped)} placement="top" maxWidth={280}>
                    <span className="equipment-panel__item-name">{equipped.name}</span>
                  </Tooltip>
                  <button
                    type="button"
                    className="equipment-panel__unequip"
                    onClick={() => {
                      if (equipped) dispatch(addItemById({ itemId: equipped.id, amount: 1 }));
                      dispatch(unequipItem(slot));
                    }}
                  >
                    Unequip
                  </button>
                </>
              ) : available.length > 0 ? (
                <select
                  className="equipment-panel__select"
                  value=""
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const item = available.find((i) => i.id === id);
                    if (item) {
                      const currentInSlot = equipment[slot];
                      if (currentInSlot) {
                        dispatch(addItemById({ itemId: currentInSlot.id, amount: 1 }));
                        dispatch(unequipItem(slot));
                      }
                      dispatch(consumeItems([{ itemId: item.id, amount: 1 }]));
                      dispatch(equipItem({ slot, item }));
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="">Equip...</option>
                  {available.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="equipment-panel__empty">Empty</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
