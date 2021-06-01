export const printByElementId = ({ id, content } = {}) => {
  const { title } = content || {};
  const printHtml = document.getElementById(id).innerHTML;
  let stylesHtml = '';

  const nodes = [...document.querySelectorAll('link[rel="stylesheet"], style')];
  nodes.forEach((node) => {
    stylesHtml += node.outerHTML;
  });

  const html = /* html */ `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || 'Print'}</title>
        ${stylesHtml}
        <style>
          @page {
            size: 210mm 279mm;
            margin: 0mm;
          }
          body {
            font-family: Montserrat, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          }
        </style>
      </head>
      <body>
        ${printHtml}
      </body>
    </html>
  `;

  const w = window.open('', '', 'left=0,top=0,width=1,height=1,toolbar=0,scrollbars=0,status=0');
  w.document.write(html);
  w.document.close();
  w.print();
};
