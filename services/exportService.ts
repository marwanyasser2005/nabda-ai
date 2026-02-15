
declare global {
  interface Window {
    html2canvas: any;
  }
}

export const exportService = {
  downloadCSV: (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(val => {
      if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
      if (typeof val === 'string' && !isNaN(Date.parse(val)) && val.length > 10) {
        return `"${new Date(val).toISOString().split('T')[0]}"`;
      }
      return val;
    }).join(','));
    
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportReportAsImage: async (elementId: string, filename: string) => {
    if (!window.html2canvas) {
      alert("Export module loading... please retry in 3 seconds.");
      return;
    }

    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      // 1. Visual Prep - Force Dark Theme & Branding
      const originalBg = element.style.backgroundColor;
      const originalPos = element.style.position;
      
      element.style.backgroundColor = '#0f172a';
      element.classList.add('p-8');
      
      // Create Header Overlay
      const header = document.createElement('div');
      header.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #334155; padding-bottom: 20px;">
           <div>
              <h1 style="color: white; font-size: 24px; font-weight: bold; margin: 0;">NABDA Intelligence Report</h1>
              <p style="color: #94a3b8; font-size: 14px; margin: 5px 0 0 0;">Generated: ${new Date().toLocaleString()}</p>
           </div>
           <div style="text-align: right;">
              <span style="background: #22d3ee; color: #0f172a; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px;">CONFIDENTIAL</span>
           </div>
        </div>
      `;
      element.insertBefore(header, element.firstChild);

      // 2. Capture
      const canvas = await window.html2canvas(element, {
        scale: 2, // High DPI
        useCORS: true,
        logging: false,
        backgroundColor: '#0f172a',
        ignoreElements: (node: any) => node.tagName === 'BUTTON' // Hide UI buttons
      });

      // 3. Restore DOM
      element.removeChild(header);
      element.style.backgroundColor = originalBg;
      element.classList.remove('p-8');

      // 4. Download
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `NABDA_${filename}_${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Export failed:", error);
      alert("Report generation failed. Please try a different browser.");
    }
  }
};
