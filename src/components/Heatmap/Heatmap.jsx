const pollHeatmap = async (id, setHeatmapUrl, setHeatmapLoading) => {
  let attempts = 0;
  const maxAttempts = 15;
  const interval = setInterval(async () => {
    attempts++;
    try {
      const res = await fetch(`https://kbaah7-ultrasound-analysis.hf.space/heatmap/${id}`);
      const data = await res.json();
      if (data.status === 'ready' && data.heatmap) {
        setHeatmapUrl(`data:image/png;base64,${data.heatmap}`);
        setHeatmapLoading(false);
        clearInterval(interval);
      } else if (data.status === 'failed' || attempts >= maxAttempts) {
        setHeatmapLoading(false);
        clearInterval(interval);
      }
    } catch (err) {
      console.error('Heatmap fetch error:', err);
      setHeatmapLoading(false);
      clearInterval(interval);
    }
  }, 8000);
};

export default pollHeatmap;