import { useState } from "react";

function ScrollableExpandableList({items}) {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => toggleItem(item.id)}
        >
          <div >{item.title}</div>
          {openItems[item.id] && (
            <div>
              <p>{item.description}</p>
              <img
                src={item.image}
                alt={item.title}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


export default ScrollableExpandableList;