import microtime from 'microtime';

export const makeId = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// BD ID is current microtime, Schedule ID id current microtime / 100
export const get16LengthId = () => microtime.now().toString();
export const get14LengthId = () => Math.round(microtime.now() / 100).toString();
