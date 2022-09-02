// ALL this may move in the frontend ?
import { createCanvas } from 'canvas';
import fs from 'fs';
import { decompress } from 'lzma-native';

// onMapInfo_V2
// XQAABAA/AgAAAC2WwEIAXhQm9CPDU7ViTh9YrTvpuU9h+9Dd9nRTB9P4RXB1wqDeCC3JjQzxgpU6VMac2FPew6gP3FNcvd66b2/mSf6j1S6O5Yo/PkOujOzaOjryt/1nEf0la9KmXeqfRir8LE3IHOKa4BBJ3YAwRR5vNUP0rfEMgP8MdqoIcmd/L4TOugujv2XBnPsSwrbBB3G98hsCNx0Zz5s/TdJcB6/ORLN3S7HDI7zJTYw7FUo8jgZBHUQfPt4pxYygQaJhjEfTGyh5ysAxJT6R4U2TYztaXJ+gWMDydxNwKwA=
// iot/p2p/getMajorMap/bd802ce4-40c6-4943-b33b-58e5b06881f0/kw9ayx/6Ket/HelperMQClientId-cn-ngiot-host14-inst3/ecosys/1234/p/hqrv/j], message: [{"header":{"pri":1,"tzm":480,"ts":"1661961714994","ver":"0.0.1","fwVer":"1.4.5","hwVer":"0.1.1"},"body":{"code":0,"msg":"ok","data":{"mid":"1738289836","pieceWidth":100,"pieceHeight":100,"cellWidth":8,"cellHeight":8,"pixel":50,"value":"1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,3451821167,3769696544,199507769,681239345,4185915752,1295764014,1295764014,1295764014,2280521425,441198355,4084017731,3599959892,3283353834,1295764014,1295764014,1295764014,3912211100,3468981704,4264564482,4260244539,3060517848,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014","type":"ol"}}}

// https://gitlab.com/michael.becker/vacuumclean/-/blob/master/deebot/deebot-core/README.md#map-details
interface MajorMap {
  mid: string /*mapId*/;
  pieceWidth: number /*columnGrid*/;
  pieceHeight: number /*rowGrid*/;
  cellWidth: number /*columnPiece-**/;
  cellHeight: number /*rowPiece*/;
  pixel: number /*pixeWidth*/;
  value: string /*crc*/;
  type: string;
}

// 0 no data
// 1 floor
// 2 wall
// 3 carpet
const mapColors = ['rgba(0,0,0,0)', '#A69E9D', '#696362', '#574C4A'];
const buffer = [...Array(800)].map(() => Array(800));

const decodeB64 = (str: string) => Buffer.from(str, 'base64');

const toBigIndian = (buffer: Buffer) => {
  const fourBytesBuffer = Buffer.allocUnsafe(4);
  fourBytesBuffer.writeUintLE(0, 0, 4);
  const start = buffer.subarray(0, 9);
  const end = buffer.subarray(9);
  const mergedBuffer = Buffer.concat([start, fourBytesBuffer, end]);
  return mergedBuffer;
};

const fillBuffer = (majorMap: MajorMap, pieceData: number[], pieceIndex: number) => {
  const rowStart = pieceIndex / majorMap.cellHeight;
  const columnStart = pieceIndex % majorMap.cellWidth;

  for (let row = 0; row < majorMap.pieceHeight; row++) {
    for (let column = 0; column < majorMap.pieceWidth; column++) {
      const bufferRow = Math.round(row + rowStart * majorMap.pieceHeight);
      const bufferColumn = Math.round(column + columnStart * majorMap.pieceWidth);
      const pieceDataPosition = majorMap.pieceHeight * row + column;

      buffer[bufferRow][bufferColumn] = pieceData[pieceDataPosition];
    }
  }
};

const drawCanvas = (buffer: number[][]) => {
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext('2d');
  for (let x = 0; x < buffer.length; x++) {
    for (let y = 0; y < buffer[x].length; y++) {
      ctx.fillStyle = mapColors[buffer[x][y] || 0];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const canvasBuffer = canvas.toBuffer('image/png');
  fs.writeFile(`/opt/app/src/map.png`, canvasBuffer, () => console.log);
};

export const BuildMap = () => {
  console.log(getMapID(test));
  mapArrayForTest.forEach((current, index) => {
    decompress(toBigIndian(decodeB64(current.data)), undefined, (res) => {
      fillBuffer(test, res.toJSON().data, current.id);
      if (index === mapArrayForTest.length - 1) {
        drawCanvas(buffer);
      }
    });
  });
};

/**
 * To get the piece ID after 'getMajorMap'
 * @param param0
 * @returns
 */
const getMapID = ({ value }: MajorMap) => {
  const NO_PIECE = '1295764014';
  return value.split(',').reduce((acc: number[], curr, index) => (curr !== NO_PIECE ? [...acc, index] : acc), []);
};

//mock

const test: MajorMap = {
  mid: '1738289836',
  pieceWidth: 100,
  pieceHeight: 100,
  cellWidth: 8,
  cellHeight: 8,
  pixel: 50,
  value:
    '1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,3451821167,3769696544,199507769,681239345,4185915752,1295764014,1295764014,1295764014,2280521425,441198355,4084017731,3599959892,3283353834,1295764014,1295764014,1295764014,3912211100,3468981704,4264564482,4260244539,3060517848,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014,1295764014',
  type: 'ol',
};

const mapArrayForTest = [
  {
    data: 'XQAABAAQJwAAAABv/f//o7f/Rz5IFXI5YVG4kijmo4YH+e7kHmgqnBaLkkTc1PGczHQ5x2r/hKh1c+HaOqMnGM3kR4/ejM6q17bWxbPGB1t1k0TjSo8ZUHgkJqKjWHVjhp1/IUgV8/So3kaEKVjjAgnk+VwyMOem925Z+AwIcR8CL337DZi0AA==',
    id: 19,
  },
  {
    data: 'XQAABAAQJwAAAABv/f//o7f/Rz5IFXI5YVG4kijmo4YH+e7Vc3woI+mIEnkUSdOieaDkFrNIUcAJ7W7lddoowP0YxwAO5WysHQP0+DZmO2LmzvVGFeWjFJnASDqxk1gIyn83qX7elJDaxyowuNrt0uDqsEAOvdM7nJyWLiuEsb1xQhiE0EMnMnkIotrFl3l4fwv0uqSOnNC9Ps0+mCvv8iG3YGy3VuMbAHJVS1FvISabfAwmIJ9e2neirVBHUAnucBQl0041hhrhUc2nT0b++4vrI05G8UltouvDh2KNFI56Y01pb1HgJpBwWExcuhkoAzZxsbwTTddHypiw+a7KCWhpSvN2ibvOTvBpMrsJ2xzcQe2E8IULhvo8ChoD6jDSHpKYf6Zd+FepPqkzgAvCxGCDTrs8S13yNsbgmYIBtQiuNWdkkHoocSKQEHHN+Y0zVCVkkKAA2WvqODyQEg4q0XmblwOQyza3fvTRB9W5z4qCh8Ir+RpHYSceXmXPhOlKy1LkHsGXYDnFzJ9UYzyUO7yTg0D5gMoAYF253wEUmJUVqlvbXvNZ8wbKgzDf3ONQCB4z5D371rTfRJ1/ryvOYjx8hX6QOcokrLgMTJPWHMH6t5J/M19JevWyWb/YStkO4Su7tj7diyPrHhgjvAdjgTUSnYsXRpcAoFAC4ybqoW9z6ZPIpmtDUPetK9Oq7UvHdcCkJM798ilhF4BDsAb/f5IRtnZ8ZZE2I7s5FgDzoGSDgrO6FoLFBtel0vKSl2B0Dy7fy19ZAHjQk1zzCk3Hdx5wTJNB0OdhAjJmKuV3Dekke1g=',
    id: 21,
  },
  {
    data: 'XQAABAAQJwAAAABv/f//o7f/Rz5IFXI5YVG4kijmo4YH6l9yPyDGMci67WbzQzb0LCvg21mWEcyR2pm7U6L5bMrrw8M02PHrp0QrUtmH/l58Bvq6Fkl2/0Zcf99PbYkS0WP3O1c+SSQKt8Ok3/3un3OR85LfsSGeiaXWeQxWLrA7ksfdOxxUyiIvUqoVF/dNuEwcL+sCqbQypxxQGYDV+Zq8bhYU08I/gDp0Bi+2A1cWawHHDWVcSov3cWjqI5W137dLp1NpApmCJC1iXuKpLNMpR7MPjnxe8StwAdODG4LQhF60x79JR+pnfZZ6ZHIAtVF2V/VKSCs+kdW1UIMjNOA/fxqVNJSx3ku0NayT8Fu8MT5G+9Qdg+FuLqk6OXQ+Xi9+GFnQyZJMPq65vQ4ve9gOcPNSGGgQZjwUlnm2ix+5ot3Ny1555qIXz4A0/JfCDweUGryxEp/iXcSGMuQ52OCH4cjVYzk5LVbXGhhxtLusI2c/PANfY/itqCL98amIHnMdG7sTbjM0rA2sU7Ol0b3W',
    id: 22,
  },
  {
    data: '"XQAABAAQJwAAAABv/f//o7f/Rz5IFXI5YVG4kijmo4YH6lJRGlbSBBY14WJkJVQPfzgl6BE5m7FHzuiAtRQaWsTQtOzwbrdDjdHSg0K0c2ezl1NAAqZby2qVm0i3YlP0SPoxurhRBXYxm8SHuiX5jwW+H6avGOJLnfI2eOflpUhAlYWQdgmBlUWpsyibL5w36dBpTm+gXaq1RBoT4hDg',
    id: 23,
  },
  {
    data: 'XQAABAAQJwAAAABuiEbYiWd5oILFxPF5f/AYyuUSoPRmwDAgK7H6RGpX+Bg/OhJtyRUX4iQW50xRjOk9sh2Kjq2DTBSQHM66d7JsA5cqcVYvHSwn2XSEJHd4A6slvCMW3cddqgAX7nrVi5TGKdJP7aZWGO/t5/MFr3mjUfmDzpRxWS9QRpVPhHbdDEQ65AA=',
    id: 27,
  },
  {
    data: 'XQAABAAQJwAAAABp/tgnG1fNgPQBryUwe3LS1LHaC9lzBOTP9AP9d0znKmIVM7bT3HipYyWqr/EZrCG51LUsjN8TkbAGRQUTk7SQYA08NQQe7MnE1XGmOrhI0D7EAbczceVsIQzTvvP5F703v2lyImClTaIcNUd94TiLLneqJu0bL/OsyQRRO/tsFrifg+8/3wCiqnKnL5aSFGVpFQHkSx7KBXz6JFQz80vAs1f5ikyOpt/ihQEAgOWZjHUbpJAOIPlDcE84g/qNmB2BJGjOfeTLQslc/VNR4Va2TBZo8VdVOL7WMQuU7EJoCCC+auibTxFrqNDbSE1MeAow7o6KrUCWBfrlE9Jz858mrl9xfQWTsbbp+929KQ2nXg7H3Ubt6jZQneJK2I5QNxyg+9OOOBW+wEqngSrqFMDIffFia93GtS0/BQlERCNICVsFz0WHpliLFRFXcLFliYETUKKjFji5eTkf8Ooo9BwD3HCVhQW95t+//idlcwE6U8pXgbS3QyX+i+lvBPICw01GaxpycEAjkdmWrC8lnkR1MroyybYMKVaa/2FjCpBzdw89jzLJzD5cyuUBtfeyy9qhOn99sTebzVufCwUw8xj3wcdvr457j6syOo4wcGMvSqB7turjOlsUFr6bdnw/V4bW5+XvSFu216XmYN/ZJySxraSJLzJjMAJYoq8hJScCmL02l/ILuGoUJJ1q+KR26D/oFR9W4Uo7aP4R24kAyGst1GH93XuuuVpMZrWUPLpHvW4udca74JF4IIZfyf4Gd4uk6kfKOj2azM6j6u6MHKH5YhXEMu/5D4AN9rl6rB868GLgvH8TacV/9Okkcv5DCc87wOlJskQJo0XzVeD4ZC3cCIEs3MJPf0Vhu0+qySZQk/r+EGtUlodKbvsPeQ9prpZkyIRKXdnXc6gZXq7OZ/Df9G7gdIbTKQ==',
    id: 28,
  },
  {
    data: 'XQAABAAQJwAAAABv/f//o7f/Rz5IFXI5YVG4kijmo4YH+e7NCcTVvyxjgqbZf5V+5oISys5wBrmrIHK/WpRBB1n4EHcSnYvC4YpysNs7V/d4St3Ak7cCkPScvqjcR5Yfx23MrBPKHa7IwsLGY4TldIxGDBl+6B5qSvAEpQMotOvjppfGkOKVBFPSpSAddtgfwSq0ym6dVaHz0XyRbnpNtEgwAqTYD6YJJb8fnL6q6trFpzkw9d8bZ5ifZvbPhBesyoB0bjVqB8Q8kHSmu115tVwRhKtfsQezkGm+EtQf0DMe+/Lfs0YmyqrD8sWKUk3xTLFygCO3R7UeGJZl7qmMhks36F0y338X/TmSKLjetp5w9Y+2zJirTp6H6yPcrCbHo8oGSuh1XgVc7e3L3Hgzl75eXmETcXzyJ6gPHFJdnj82TyFPLrgsQlOExejc04BaZ68jn2stEsT06qx5x9Xe3HoumYrzM8FKn2j5TE0IxEkWyj6Dd0d4EwyDE9tr4djwlZ2ixyJljFrNhWPBkD5N72hxsZxkjn7cYq0sD9nEhXTmpLjfWbTgQKK6bfERIbgQ+75LNjFF9//x+OjhjQr6qL9hhorE0hg32MtUyL5q6cneW/x4veXaPpGEIkXG9MZHGIuRuDb7LhZvYYkRcOp05E2CgmSUwImnQVQF6q4RQ8q0a9NNotlQp4lDT1oSuwl81HANiASwGhKH1/6YaX6E+QS+YWPVWON4vXuLOckmAA==',
    id: 20,
  },
  {
    data: 'XQAABAAQJwAAAADq/NQdPLfH9JuUU5nkY9asaXcPHVbB0H3Mgs+eh7kKebSKb451pV6Tiy3uXj16AnLxq7loZMyxbHTLx/fM3R5jFnbxAHWZ2f39zE/PtJYcY/MyzpUrrFBeKvKI/vWwVWGAxc9ndwfLvgO1d3ZQGEQ35P8/KFM47FpJYL6vAMjiHJ3Z6UBz2VF2PSlveVPWKVMpoi5zY/Yio4nDYCSwmX6lPSvK0EuZuHTcqPdEVEVpx3H3HMZnFgsUP0d1lZ0zaWALHzhhMQ+qjJ4FW/13cElxjNG/Y2mwJAbSqw72i6e5RtiWkb5Mw97KQuVwpsn8rddQRlWgMRMnUarrQ+QY8fpM72o1GTYTxabZmmw96gIfuZi4yEyUNb7UFSTeCHe5VlUh4OhZmA9DSVjKXwWs+9wID4m4SCDGW25n7iqRv1COEAdX2KgIDJ1n0YQXEYQ2WjKNmCFwml5qXfLT/w0prPAGM0kgJesdAgTAhFWwHWksMtL2SoSBD+xbQb9QMnD/bfNdPuiTOzIL7AhRy8+oLPkYmE/I9g5Dqy4MIDkIZqV8xEMLeLz40QlqKbBDFZbDAHA/37xjlkmFhMY1JJX8z1ugcluq2TH28JHCODBLz6clY/mdEEgSh7dgvCNKEV+KVzJbfySErv0SI8gzJ4Dmv0sAnPA=',
    id: 29,
  },
  {
    data: 'XQAABAAQJwAAAADsvI0PmMNkk6s2ryHlw0a+IzaNQDOcKbpLABbBQQMMMhlHEQxCUIu/KxFn7Z6yBP/w8laZ5ehxX/zbqTWHvldz8nrDdi3r/keofE/nJMYVARJLKRPisiOcrbhewGrGMeVnb/8RjP3i/Gzz4KJDugh72GRj/w2rzZ2lqwoC+g/4Ethol1a6F0mp+XLWyhXqScO78zTLRqA2iRYwzaPgjZj0VxPzs2bggBJnJUPoLWAy7x2J7vLcJNKou7OQa/1mH9/rwTTr5AOxdOngzVOyX+Heif08LbdrwNgRKqA3q55b/IsgCkSrMatBpWFNLlN3+qiK4mBnEo2C1/vDG+uKwrZBtaRUwGDVOLju8RGo4yFgDrgBF7tIE0V2q6hXlMhJHAS1L/QcJgX1488n8ricVjc9WKbEmJzRKIxz11JwNjbFb1e2VO8lsVink/4ob/nBOFfJRsSwq80qeOOGJxZJEd5pkEJXgx1iAA==',
    id: 31,
  },
  {
    data: 'XQAABAAQJwAAAADuDEfAAOovspnQRROw3wMpWR86IL6cDZDkLTEs9tE0z0HUwFR9ivtxKsTSFMFxAqV9hDeJGParPt2JZST042bcgsiTep5zGUnhAZMpsF29kAGl/S1qAC6/Jlt8/t7JYXl6NOH2nTROqceM1sNVrcww1E99FLAq5SNgxdw97GxIPaPItKkst8HKrTLFH5jpU/BAwMtZoG1VFZd52miMxOMgGji34UDgGIT9HWGu3frqzvJ8a7hIwVzROV/NqpZr1ZZzyugFQnLSLEOVerCBCXcUtT0i0V8Gg7UaV5bK+zlw8osGd/0uJTNiXvrXf3gCsAvhBi3W6REwKbwb71OIseywTyPbK90iZI32kR65GaVyuLCGiHexFDZgDUQoHdhCfOuE2Rc9oAgc/kcHdREWvlZD0VIkR0sEdOU/hDx3aERu3yey0SGYQvKD51Omm9XT9P+DuhYLiif6hpWJW3z+kOef+9/u4Smy73/XzBbsuzysaqMLi+/ZjnYjW3izeR60mkAMJpJ72WWW+bmA5WED5nue29pTl7hV2Mt9pGKwnWm81ects0HJ6APeTLdwBd/t8EMoOQNF+zzKKyVcflszEou2JnwC0YIomzbqJqsty0XhBL891m0aAozdMbQ6+yprPif23UDDSLVe62XdgYtsb+OA/ktgFpPlM1yZOyeWDA6p4nvs2D34fJeRnthB9Q6D5AA=',
    id: 30,
  },
  {
    data: 'XQAABAAQJwAAAADuBEngfCfasKLZV9IH6H9nnvkTUxrTKQcp/1jvSbo9zFYmDJdtTezuMEk0ktdKW21ownjrG1vd70RWJj4RcRDGuREXHImaMc4fGbSG00DF1WkVsZU671eExFbwNPe1EcsqdH3UiC5eVymky53kjS321UQivY5gKz95poBnKWIe5j6rWZptZEkg4vDsygb5tstRnAA=',
    id: 36,
  },
  {
    data: 'XQAABAAQJwAAAABpftpH+4yFqTiOMxoS2kYMCu47vWGBTekIqZVCGdI4cGyNmRZjI2iiZmnsOp2mePcwFyobNz2gUoKkGDXzxP+zfkw5y7fbIYr5LHftxOd5r1k43KJTzrfnVvEtaAdtQBVhLxbuycXHZ72dmNL9mskLIjMvCQA=',
    id: 37,
  },
  {
    data: 'XQAABAAQJwAAAABuREjpH/uLabvOQGC0S+rTi+HLfJmTgEi7MmZ8flCtlVrgY2pmLbeMLRm1/zurB4F5/yvLShtqAA==',
    id: 38,
  },
];
