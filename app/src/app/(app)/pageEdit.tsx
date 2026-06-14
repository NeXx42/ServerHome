import { useEffect, useState } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core"
import { ClientConfig, Config_Module, ModuleType, moduleTypes } from "../shared/config"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";

import "./pageEdit.css"
import { saveModules } from "../shared/helperFunctions";

interface LocalModule extends Config_Module {
    id: string
}

export default function ({ config, sessionId }: { config: ClientConfig, sessionId: string }) {
    const [items, setItems] = useState<LocalModule[]>([]);
    const [selectedType, setSelectedType] = useState<ModuleType>("cpu");

    useEffect(() => {
        setItems((config.modules ?? []).map(m => ({
            ...m,
            id: crypto.randomUUID()
        })));

    }, [config.modules])


    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (!over || active.id === over.id)
            return;

        setItems((items) => {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);

            return arrayMove(items, oldIndex, newIndex);
        });
    }

    const saveConfig = () => {
        saveModules(items);
    }

    const addConfig = () => {
        setItems(prev => [...prev, {
            type: selectedType,
            id: crypto.randomUUID()
        }]);
    }

    const removeConfig = (id: string) => {
        setItems(prev => [...prev.filter(p => p.id !== id)])
    }

    return (
        <div className="PageEdit_Foldout" onClick={e => e.stopPropagation()}>
            <div className="PageEdit_Items">
                {
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            {items.map((item, i) => (
                                <Entry key={item.id} item={item} removeCallback={removeConfig} />
                            ))}
                        </SortableContext>
                    </DndContext>
                }
            </div>

            <div className="PageEdit_Controls">
                <button onClick={saveConfig}>Save</button>
                <select value={selectedType} onChange={e => setSelectedType(e.target.value as ModuleType)}>
                    {moduleTypes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <button onClick={addConfig}>Add</button>
            </div>
        </div>
    )
}

function Entry({ item, removeCallback }: { item: LocalModule, removeCallback: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: `translateY(${transform?.y ?? 0}px)`,
        transition,
    };

    return (
        <div className="PageEdit_Foldout_Entry" ref={setNodeRef} style={style}   >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" {...attributes}  {...listeners}>
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
            </svg>
            <span>
                {item.type}
            </span>
            <button className="negative" onClick={() => removeCallback(item.id)}>

                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
            </button>
        </div>
    );
}
