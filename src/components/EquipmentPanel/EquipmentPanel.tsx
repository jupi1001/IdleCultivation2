import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { equipItem, unequipItem } from "../../state/reducers/characterSlice";
import { ALL_EQUIPMENT_SLOTS, EQUIPMENT_SLOT_LABELS } from "../../types/EquipmentSlot";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import "./EquipmentPanel.css";

export const EquipmentPanel = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const { equipment, items } = character;

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
                  <span className="equipment-panel__item-name">{equipped.name}</span>
                  <button
                    type="button"
                    className="equipment-panel__unequip"
                    onClick={() => dispatch(unequipItem(slot))}
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
                    if (item) dispatch(equipItem({ slot, item }));
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
