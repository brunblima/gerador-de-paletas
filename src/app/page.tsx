"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Download, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ColorPaletteGenerator() {
  const [palette, setPalette] = useState<string[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<string[][]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Função para gerar um hex aleatório
  const getRandomHex = () => {
    const letters = "0123456789ABCDEF";
    let color = "";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Buscar paleta de cores da API
  const fetchColorPalette = async () => {
    try {
      const randomHex = getRandomHex(); // Gerando um novo hex a cada requisição
      const response = await fetch(
        `https://www.thecolorapi.com/scheme?hex=${randomHex}&mode=analogic&count=5`
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();

      if (!data.colors || data.colors.length === 0) {
        throw new Error("Nenhuma cor encontrada na resposta da API.");
      }
      interface ColorData {
        hex: { value: string };
      }

      const colors = data.colors.map((color: ColorData) => color.hex.value);

      return colors;
    } catch (error) {
      console.error("Erro ao buscar paleta:", error);
      return [];
    }
  };

  // Gerar uma nova paleta
  const generatePalette = useCallback(async () => {
    const newPalette = await fetchColorPalette();
    if (newPalette.length > 0) {
      setPalette(newPalette);
    }
  }, []);

  // Salvar Paleta Abaixo
  const savePalette = () => {
    if (palette.length > 0) {
      setSavedPalettes([...savedPalettes, palette]);
      toast("Paleta Salva", {
        description: "Suas cores foram salvas abaixo.",
      });
    }
  };

  // Exportar em JSON
  const exportPalette = () => {
    if (palette.length > 0) {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(palette));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "color-palette.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  // Copiar Cor
  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast("Cor copiada", {
      description: `${color} foi copiado para a área de transferência.`,
    });
  };

  // Alternar Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Atualizar Componente
  useEffect(() => {
    generatePalette();
  }, [generatePalette]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Gerador de Paletas de Cores</h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode" className="text-sm">
              Dark Mode
            </Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </div>

        {/* Mostra as cores */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {palette.map((color, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer flex items-center justify-center relative"
              style={{ backgroundColor: color }}
              onClick={() => copyColor(color)}
            >
              <span className="absolute bottom-2 px-2 py-1 rounded text-xs font-mono bg-white bg-opacity-75 text-black">
                {color}
              </span>
            </div>
          ))}
        </div>

        {/* Botoões de ação */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            onClick={generatePalette}
            className="transition-all duration-300 hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Gerar Nova Paleta
          </Button>
          <Button
            onClick={savePalette}
            className="transition-all duration-300 hover:scale-105 border-blue-500 text-blue-500 hover:border-blue-600 hover:text-white hover:bg-blue-600"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Paleta
          </Button>
          <Button
            onClick={exportPalette}
            className="transition-all duration-300 hover:scale-105 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar em JSON
          </Button>
        </div>

        {/* Salvar Paleta */}
        {savedPalettes.length > 0 && (
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Salvar Paleta
            </h2>
            <div className="space-y-4">
              {savedPalettes.map((savedPalette, paletteIndex) => (
                <div
                  key={paletteIndex}
                  className="flex rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {savedPalette.map((color, colorIndex) => (
                    <div
                      key={`${paletteIndex}-${colorIndex}`}
                      className="flex-1 h-12 cursor-pointer transition-transform duration-300 hover:scale-y-110"
                      style={{ backgroundColor: color }}
                      onClick={() => copyColor(color)}
                      title={color}
                    />
                  ))}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none"
                    onClick={() => {
                      setPalette(savedPalettes[paletteIndex]);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
