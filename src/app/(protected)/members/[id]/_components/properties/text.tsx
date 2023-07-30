"use client";
import React, { useEffect, useState } from "react";
import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function MemberPropertyText({
  title,
  value,
  canEdit,
  onChange,
}: {
  title: string;
  value: string;
  canEdit: boolean;
  onChange?: (value: string) => void;
}) {
  const [isEditing, setEditing] = useState(false);
  const [editedValue, setEditedValue] = useState("");

  return (
    <div className="flex flex-row gap-2 text-xl">
      <div className="font-bold">{title}:</div>
      {isEditing ? (
        <div className="flex-grow text-right">
          <input
            className="text-right"
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
          />
        </div>
      ) : (
        <div className="flex-grow text-right">{value}</div>
      )}
      {canEdit ? (
        <>
          {isEditing ? (
            <>
              <div>
                <CheckIcon
                  className="h-full cursor-pointer"
                  onClick={() => {
                    onChange?.(editedValue);
                    setEditing(false);
                  }}
                />
              </div>
              <div>
                <XMarkIcon
                  className="h-full cursor-pointer"
                  onClick={() => setEditing(false)}
                />
              </div>
            </>
          ) : (
            <div>
              <PencilIcon
                className="h-full cursor-pointer"
                onClick={() => {
                  setEditedValue(value);
                  setEditing(true);
                }}
              />
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
