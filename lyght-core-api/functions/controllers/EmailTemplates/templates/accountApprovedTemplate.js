/* eslint-disable max-len */
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
        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
          ${t.accountApproved[lang]}
        </p>
        <br>
        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
          ${t.inviteLogin[lang]}
        </p>
        ${Button({
          text: t.viewProjects[lang],
          link: 'https://lyghtapp.com/projects',
          color: 'primary',
        })}
      </td>
    </tr>
  `,
})}
`;

module.exports = template;
