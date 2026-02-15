import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { purchaseTalentLevel } from "../../state/reducers/characterSlice";
import { TALENT_TREE_TIERS, formatRealmGateLabel } from "../../constants/talents";
import { getTalentNodeState } from "../../constants/talentHelpers";
import { TalentNodeCard } from "../../components/TalentNodeCard/TalentNodeCard";
import "./CultivationTreeContainer.css";

/** Tree order: bottom = roots (Mortal), scroll up = higher realms. So we render tiers reversed (highest first in DOM) and scroll to bottom on load. */
const TREE_TIERS_TOP_TO_BOTTOM = [...TALENT_TREE_TIERS].reverse();

export const CultivationTreeContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const { qi, realm, realmLevel, talentLevels } = character;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }, []);

  return (
    <div className="cultivationTree">
      <h2 className="cultivationTree__title">Cultivation Tree</h2>
      <p className="cultivationTree__subtitle">
        Spend Qi to unlock permanent talents. Scroll up for higher realms.
      </p>
      <div className="cultivationTree__scroll" ref={scrollRef}>
        <div className="cultivationTree__tiers">
          {TREE_TIERS_TOP_TO_BOTTOM.map((tier, reversedIndex) => {
            const tierIndex = TALENT_TREE_TIERS.length - 1 - reversedIndex;
            const isFirstInTree = reversedIndex === 0;
            return (
              <React.Fragment key={tierIndex}>
                {!isFirstInTree && <div className="cultivationTree__connector" aria-hidden />}
                <div className="cultivationTree__realmGate">
                  <span className="cultivationTree__realmGate-line" />
                  <span className="cultivationTree__realmGate-label">
                    {tier.realmGate
                      ? formatRealmGateLabel(tier.realmGate.realmId, tier.realmGate.realmLevel)
                      : "Mortal"}
                  </span>
                  <span className="cultivationTree__realmGate-line" />
                </div>
                <div className="cultivationTree__row">
                  {tier.nodes.map((node) => {
                    const currentLevel = talentLevels[node.id] ?? 0;
                    const state = getTalentNodeState(node, qi, realm, realmLevel, talentLevels);
                    return (
                      <TalentNodeCard
                        key={node.id}
                        node={node}
                        currentLevel={currentLevel}
                        state={state}
                        onPurchase={() => dispatch(purchaseTalentLevel(node.id))}
                      />
                    );
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
