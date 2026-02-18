import React, { useState } from 'react';
import { Diagram, DiagramSpec } from '../../types';
import { X, Save } from 'lucide-react';
import { theme } from '../../services/designSystem';

interface DiagramEditorProps {
  diagram: Diagram | null;
  onSave: (diagram: Diagram) => void;
  onClose: () => void;
}

const DIAGRAM_TYPES = [
  { id: 'flywheel', name: 'Flywheel Circle', description: 'Circular flow diagram' },
  { id: 'architecture', name: 'Layered Architecture', description: 'Vertical layered structure' },
  { id: 'timeline', name: 'Timeline Graphic', description: 'Horizontal timeline visualization' },
  { id: 'gradient-accent', name: 'Gradient Accent', description: 'Simple gradient decoration' }
];

export const DiagramEditor: React.FC<DiagramEditorProps> = ({
  diagram,
  onSave,
  onClose
}) => {
  const [diagramType, setDiagramType] = useState<string>(diagram?.type || 'flywheel');
  const [name, setName] = useState<string>(diagram?.name || '');
  const [spec, setSpec] = useState<DiagramSpec>(diagram?.spec || {});

  const handleSave = () => {
    const updatedDiagram: Diagram = {
      id: diagram?.id || `diagram-${Date.now()}`,
      type: diagramType as Diagram['type'],
      spec,
      name: name || undefined
    };
    onSave(updatedDiagram);
  };

  const renderEditor = () => {
    switch (diagramType) {
      case 'flywheel':
        return <FlywheelEditor spec={spec} onChange={setSpec} />;
      case 'architecture':
        return <ArchitectureEditor spec={spec} onChange={setSpec} />;
      case 'timeline':
        return <TimelineEditor spec={spec} onChange={setSpec} />;
      case 'gradient-accent':
        return <GradientAccentEditor spec={spec} onChange={setSpec} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">
            {diagram ? 'Edit Diagram' : 'Create Diagram'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-[12px] hover:bg-slate-100 text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagram Name */}
        <div className="mb-6">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Diagram Name (Optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Main Flywheel"
            className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
          />
        </div>

        {/* Diagram Type */}
        <div className="mb-6">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Diagram Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {DIAGRAM_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setDiagramType(type.id)}
                className={`p-4 rounded-[20px] border text-left transition-all ${
                  diagramType === type.id
                    ? 'bg-slate-100 border-slate-300 shadow-sm'
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="font-medium text-sm text-black mb-1">
                  {type.name}
                </div>
                <div className="text-xs text-slate-500">
                  {type.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Type-specific Editor */}
        {renderEditor()}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-black rounded-[16px] font-bold text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-black hover:bg-slate-800 text-white rounded-[16px] font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Diagram
          </button>
        </div>
      </div>
    </div>
  );
};

// Flywheel Editor
const FlywheelEditor: React.FC<{
  spec: DiagramSpec;
  onChange: (spec: DiagramSpec) => void;
}> = ({ spec, onChange }) => {
  const nodes = spec.nodes || [
    { label: 'Data' },
    { label: 'Prediction' },
    { label: 'Decision' },
    { label: 'Improvement' },
    { label: 'More Data' }
  ];

  const updateNode = (index: number, updates: Partial<{ label: string }>) => {
    const newNodes = [...nodes];
    newNodes[index] = { ...newNodes[index], ...updates };
    onChange({ ...spec, nodes: newNodes });
  };

  const addNode = () => {
    onChange({ ...spec, nodes: [...nodes, { label: 'New Node' }] });
  };

  const removeNode = (index: number) => {
    if (nodes.length > 2) {
      onChange({ ...spec, nodes: nodes.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        Nodes
      </label>
      {nodes.map((node, index) => (
        <div key={index} className="flex items-center gap-3">
          <input
            type="text"
            value={node.label}
            onChange={(e) => updateNode(index, { label: e.target.value })}
            className="flex-1 px-4 py-2 rounded-[12px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
            placeholder="Node label"
          />
          {nodes.length > 2 && (
            <button
              onClick={() => removeNode(index)}
              className="px-3 py-2 rounded-[12px] bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addNode}
        className="w-full py-2 px-4 rounded-[12px] bg-slate-200 hover:bg-slate-300 text-sm font-medium text-slate-700"
      >
        + Add Node
      </button>
    </div>
  );
};

// Architecture Editor
const ArchitectureEditor: React.FC<{
  spec: DiagramSpec;
  onChange: (spec: DiagramSpec) => void;
}> = ({ spec, onChange }) => {
  const layers = spec.layers || [
    { name: 'Feedback Loop', description: 'Real-time predictions and model serving' },
    { name: 'Inference', description: 'Model training and optimization' },
    { name: 'Training', description: 'Feature engineering and storage' },
    { name: 'Feature Store', description: 'Raw data ingestion and processing' },
    { name: 'Data Layer', description: '' }
  ];

  const updateLayer = (index: number, updates: Partial<{ name: string; description: string }>) => {
    const newLayers = [...layers];
    newLayers[index] = { ...newLayers[index], ...updates };
    onChange({ ...spec, layers: newLayers });
  };

  const addLayer = () => {
    onChange({ ...spec, layers: [...layers, { name: 'New Layer', description: '' }] });
  };

  const removeLayer = (index: number) => {
    if (layers.length > 1) {
      onChange({ ...spec, layers: layers.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        Layers
      </label>
      {layers.map((layer, index) => (
        <div key={index} className="space-y-2 p-4 rounded-[16px] bg-slate-50 border border-slate-100">
          <input
            type="text"
            value={layer.name}
            onChange={(e) => updateLayer(index, { name: e.target.value })}
            className="w-full px-4 py-2 rounded-[12px] bg-white border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium"
            placeholder="Layer name"
          />
          <input
            type="text"
            value={layer.description || ''}
            onChange={(e) => updateLayer(index, { description: e.target.value })}
            className="w-full px-4 py-2 rounded-[12px] bg-white border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
            placeholder="Layer description (optional)"
          />
          {layers.length > 1 && (
            <button
              onClick={() => removeLayer(index)}
              className="px-3 py-1.5 rounded-[8px] bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addLayer}
        className="w-full py-2 px-4 rounded-[12px] bg-slate-200 hover:bg-slate-300 text-sm font-medium text-slate-700"
      >
        + Add Layer
      </button>
    </div>
  );
};

// Timeline Editor
const TimelineEditor: React.FC<{
  spec: DiagramSpec;
  onChange: (spec: DiagramSpec) => void;
}> = ({ spec, onChange }) => {
  const items = spec.items || [
    { label: 'Phase 1', date: 'Q1 2024', description: 'Foundation' },
    { label: 'Phase 2', date: 'Q2 2024', description: 'Deployment' },
    { label: 'Phase 3', date: 'Q3 2024', description: 'Scaling' }
  ];

  const updateItem = (index: number, updates: Partial<{ label: string; date: string; description: string }>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ ...spec, items: newItems });
  };

  const addItem = () => {
    onChange({ ...spec, items: [...items, { label: 'New Item', date: '', description: '' }] });
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      onChange({ ...spec, items: items.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        Timeline Items
      </label>
      {items.map((item, index) => (
        <div key={index} className="space-y-2 p-4 rounded-[16px] bg-slate-50 border border-slate-100">
          <input
            type="text"
            value={item.label}
            onChange={(e) => updateItem(index, { label: e.target.value })}
            className="w-full px-4 py-2 rounded-[12px] bg-white border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium"
            placeholder="Item label"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={item.date || ''}
              onChange={(e) => updateItem(index, { date: e.target.value })}
              className="px-4 py-2 rounded-[12px] bg-white border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
              placeholder="Date (optional)"
            />
            <input
              type="text"
              value={item.description || ''}
              onChange={(e) => updateItem(index, { description: e.target.value })}
              className="px-4 py-2 rounded-[12px] bg-white border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
              placeholder="Description (optional)"
            />
          </div>
          {items.length > 1 && (
            <button
              onClick={() => removeItem(index)}
              className="px-3 py-1.5 rounded-[8px] bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 px-4 rounded-[12px] bg-slate-200 hover:bg-slate-300 text-sm font-medium text-slate-700"
      >
        + Add Item
      </button>
    </div>
  );
};

// Gradient Accent Editor
const GradientAccentEditor: React.FC<{
  spec: DiagramSpec;
  onChange: (spec: DiagramSpec) => void;
}> = ({ spec, onChange }) => {
  const direction = spec.direction || 'diagonal';
  const colors = spec.colors || [
    theme.colors.gradient.indigo,
    theme.colors.gradient.purple,
    theme.colors.gradient.pink,
    theme.colors.gradient.orange
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Direction
        </label>
        <select
          value={direction}
          onChange={(e) => onChange({ ...spec, direction: e.target.value as any })}
          className="w-full px-4 py-2 rounded-[12px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
          <option value="diagonal">Diagonal</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Colors (from theme)
        </label>
        <div className="text-xs text-slate-500">
          Using Intelligence Gradient colors from theme
        </div>
      </div>
    </div>
  );
};
