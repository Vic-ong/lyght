/* eslint-disable max-len */
const mapColor = {
  primary: '#08ae8b',
  secondary: '#e7ad3c',
};

const Button = ({ text, link, color = 'primary' }) => /* html */ `
<table border="0" cellpadding="0" cellspacing="0" class="btn btn-${color}" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
  <tbody>
    <tr>
      <td align="left" style="font-family: sans-serif; font-size: 11px; vertical-align: top; padding-bottom: 15px;">
        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
          <tbody>
            <tr>
              <td style="font-family: sans-serif; font-size: 12px; vertical-align: top; background-color: ${mapColor[color]}; border-radius: 22.5px; text-align: center;">
                <a href="${link}" target="_blank" style="display: inline-block; color: #ffffff; background-color: ${mapColor[color]}; border: solid 1px ${mapColor[color]}; border-radius: 22.5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 12px; font-weight: bold; margin: 0; padding: 14px 25px; text-transform: capitalize; border-color: ${mapColor[color]};">
                  ${text}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
`;

module.exports = {
  Button,
};
