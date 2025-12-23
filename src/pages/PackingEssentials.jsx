import { useState } from 'react';
import PropTypes from 'prop-types';
import InputModal from '../components/InputModal';
import AlertModal from '../components/AlertModal';
import EmailShare from '../components/EmailShare';
import './PackingEssentials.css';

const PACKING_CATEGORIES = [
  'Clothing',
  'Electronics',
  'Documents',
  'Toiletries',
  'Accessories',
  'Medications',
  'Food & Snacks',
  'Other'
];

export default function PackingEssentials() {
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Clothing',
    quantity: '1',
    packed: false
  });

  const handleAddItem = (itemName) => {
    if (!itemName || !itemName.trim()) {
      setAlertMessage('Item name cannot be empty.');
      setShowAlertModal(true);
      return;
    }

    if (items.some(item => item.name.toLowerCase() === itemName.trim().toLowerCase())) {
      setAlertMessage('This item already exists in your list.');
      setShowAlertModal(true);
      return;
    }

    setItems([
      ...items,
      {
        id: Date.now(),
        name: itemName.trim(),
        category: newItem.category,
        quantity: parseInt(newItem.quantity) || 1,
        packed: false
      }
    ]);

    setNewItem({
      name: '',
      category: 'Clothing',
      quantity: '1',
      packed: false
    });
    setShowAddModal(false);
  };

  const handleEditItem = (itemName) => {
    if (!itemName || !itemName.trim()) {
      setAlertMessage('Item name cannot be empty.');
      setShowAlertModal(true);
      return;
    }

    const trimmedName = itemName.trim();
    if (items.some(item => item.id !== editingItem.id && item.name.toLowerCase() === trimmedName.toLowerCase())) {
      setAlertMessage('This item name already exists.');
      setShowAlertModal(true);
      return;
    }

    setItems(items.map(item =>
      item.id === editingItem.id
        ? { ...item, name: trimmedName, category: newItem.category, quantity: parseInt(newItem.quantity) || 1 }
        : item
    ));

    setEditingItem(null);
    setNewItem({
      name: '',
      category: 'Clothing',
      quantity: '1',
      packed: false
    });
    setShowEditModal(false);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleTogglePacked = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      packed: item.packed
    });
    setShowEditModal(true);
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const totalItems = items.length;
  const packedItems = items.filter(item => item.packed).length;
  const progressPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <section id="packing" className="PackingEssentials">
      <div className="PackingEssentials__Header">
        <div>
          <p className="Pill Pill--dark">Packing Essentials</p>
          <h2>Never forget what to pack</h2>
          <p className="Lede Lede--small">
            Create your packing list, check off items as you pack, and stay organized.
          </p>
        </div>
        <div className="PackingEssentials__Stats">
          <div>
            <p className="Label">Total Items</p>
            <p className="Value Value--large">{totalItems}</p>
          </div>
          <div>
            <p className="Label">Packed</p>
            <p className="Value Value--large">{packedItems}/{totalItems}</p>
          </div>
          <div>
            <p className="Label">Progress</p>
            <p className="Value Value--large">{progressPercentage}%</p>
          </div>
        </div>
      </div>

      <div className="PackingEssentials__ProgressBar">
        <div
          className="PackingEssentials__ProgressFill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="PackingEssentials__Controls">
        <button className="Button Button--primary" onClick={() => setShowAddModal(true)}>
          + Add Item
        </button>
        {items.length > 0 && (
          <>
            <button
              className="Button Button--ghost"
              onClick={() => setItems(items.map(item => ({ ...item, packed: false })))}
            >
              Reset All
            </button>
            <EmailShare packingItems={items} />
          </>
        )}
      </div>

      {items.length === 0 ? (
        <div className="Empty">
          <p>No items added yet. Click "Add Item" to start building your packing list.</p>
        </div>
      ) : (
        <div className="PackingEssentials__Content">
          {Object.keys(groupedItems).map(category => (
            <div key={category} className="PackingEssentials__Category">
              <h3 className="PackingEssentials__CategoryTitle">{category}</h3>
              <div className="PackingEssentials__ItemsList">
                {groupedItems[category].map(item => (
                  <div
                    key={item.id}
                    className={`PackingEssentials__Item ${item.packed ? 'PackingEssentials__Item--packed' : ''}`}
                  >
                    <div className="PackingEssentials__ItemLeft">
                      <input
                        type="checkbox"
                        checked={item.packed}
                        onChange={() => handleTogglePacked(item.id)}
                        className="PackingEssentials__Checkbox"
                      />
                      <div className="PackingEssentials__ItemInfo">
                        <p className="PackingEssentials__ItemName">{item.name}</p>
                        {item.quantity > 1 && (
                          <p className="PackingEssentials__ItemQuantity">Qty: {item.quantity}</p>
                        )}
                      </div>
                    </div>
                    <div className="PackingEssentials__ItemActions">
                      <button
                        className="Button Button--ghost Button--small"
                        onClick={() => openEditModal(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="Button Button--ghost Button--small"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="PackingEssentials__AddForm">
          <h3>Add New Item</h3>
          <div className="PackingEssentials__FormGrid">
            <div className="PackingEssentials__FormGroup">
              <label>Item Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g., Passport, Charger, Toothbrush"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newItem.name.trim()) {
                    handleAddItem(newItem.name);
                  }
                }}
              />
            </div>
            <div className="PackingEssentials__FormGroup">
              <label>Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                {PACKING_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="PackingEssentials__FormGroup">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>
          <div className="PackingEssentials__FormActions">
            <button className="Button Button--ghost" onClick={() => {
              setShowAddModal(false);
              setNewItem({ name: '', category: 'Clothing', quantity: '1', packed: false });
            }}>
              Cancel
            </button>
            <button className="Button Button--primary" onClick={() => handleAddItem(newItem.name)}>
              Add Item
            </button>
          </div>
        </div>
      )}

      {showEditModal && editingItem && (
        <div className="PackingEssentials__AddForm">
          <h3>Edit Item</h3>
          <div className="PackingEssentials__FormGrid">
            <div className="PackingEssentials__FormGroup">
              <label>Item Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g., Passport, Charger, Toothbrush"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newItem.name.trim()) {
                    handleEditItem(newItem.name);
                  }
                }}
              />
            </div>
            <div className="PackingEssentials__FormGroup">
              <label>Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                {PACKING_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="PackingEssentials__FormGroup">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>
          <div className="PackingEssentials__FormActions">
            <button className="Button Button--ghost" onClick={() => {
              setShowEditModal(false);
              setEditingItem(null);
              setNewItem({ name: '', category: 'Clothing', quantity: '1', packed: false });
            }}>
              Cancel
            </button>
            <button className="Button Button--primary" onClick={() => handleEditItem(newItem.name)}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Notice"
        message={alertMessage}
        type="warning"
      />
    </section>
  );
}

PackingEssentials.propTypes = {
  // Component doesn't receive props currently
};

