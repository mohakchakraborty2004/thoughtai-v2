'use client'

import React, { useState } from "react";
import Head from "next/head";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<"logo" | "banner">("logo");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setImageUrl("");
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate image");
      }
      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error("No image URL received");
      }
    } catch (err) {
      setError("Error generating image. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>thoughtai</title>
      </Head>

      <h1 className="text-2xl font-bold mb-4">thoughtai</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "logo" | "banner")}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="logo">Logo</option>
          <option value="banner">Channel Banner</option>
        </select>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Image"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {imageUrl && (
        <div>
          <h2 className="text-xl font-bold mb-2">Generated Image:</h2>
          <div className={type === "logo" ? "w-64 h-64" : "w-full aspect-[16/9]"}>
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full h-full object-contain"
              onError={() => {
                setError("Error displaying the generated image.");
              }}
            />
          </div>

          <a href={imageUrl} download="generated-image.png">
            <button className="mt-4 p-2 bg-green-500 text-white rounded">
              Download Image
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;