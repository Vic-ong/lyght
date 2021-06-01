/* eslint-disable max-len */
const { formatCurrency } = require('@/utils/format');
const { setHeader, setContent } = require('../base');
const { Button } = require('../components');
const t = require('../wordings.json');

const template = (params, lang) => /* html */ `
${setHeader()}
${setContent({
  lang,
  body: /* html */ `
    <tr>
      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
        <p style="font-family: sans-serif; font-size: 24px; font-weight: bold; margin: 0; Margin-bottom: 15px;">
          Hi ${params.name},
        </p>
        <p style="font-family: sans-serif; font-size: 18px; font-weight: bold; margin: 0; Margin-bottom: 15px;">
          ${t.orderCancelledGreetings[lang]}${params.project.name}
        </p>
        <br>
        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 9px;">
          ${t.orderNumber[lang]}: ${params.order.orderNumber}
        </p>
        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 9px;">
          ${t.status[lang]}: ${t.statusCancelled[lang]}
        </p>
        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 9px;">
          ${t.orderQuantity[lang]}: ${params.order.quantity}
        </p>
        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
          ${t.orderTotalAmount[lang]}: ${formatCurrency(params.order.total).display}
        </p>
        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
          ${t.orderCancelledDesc[lang]}
        </p>
        ${Button({
          text: t.viewOrder[lang],
          link: 'https://lyghtapp.com/my-orders',
          color: 'primary',
        })}
      </td>
    </tr>
  `,
})}
`;

module.exports = template;
