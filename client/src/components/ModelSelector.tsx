import { AgentConfig, ModelOption } from '../types';

interface ModelSelectorProps {
  config: AgentConfig;
  onChange: (config: AgentConfig) => void;
  textModels: ModelOption[];
  imageModels: ModelOption[];
  searchModels: ModelOption[];
}

export function ModelSelector({
  config,
  onChange,
  textModels,
  imageModels,
  searchModels,
}: ModelSelectorProps) {
  return (
    <div className="model-selector">
      <h3>⚙️ Configuração de Modelos</h3>
      <div className="model-grid">
        <div className="model-option">
          <label>💬 Modelo de Chat</label>
          <select
            value={config.textModel}
            onChange={(e) => onChange({ ...config, textModel: e.target.value })}
          >
            {textModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div className="model-option">
          <label>🎨 Modelo de Imagem</label>
          <select
            value={config.imageModel}
            onChange={(e) =>
              onChange({ ...config, imageModel: e.target.value })
            }
          >
            {imageModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div className="model-option">
          <label>🔍 Modelo de Pesquisa</label>
          <select
            value={config.searchModel}
            onChange={(e) =>
              onChange({ ...config, searchModel: e.target.value })
            }
          >
            {searchModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
