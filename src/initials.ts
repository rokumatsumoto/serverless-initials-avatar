import sharp from 'sharp';
// @ts-ignore
import initials from 'initials';
import uploadBuffer from './s3';
import Random from './random';
import BACKGROUND_COLORS from './constants';

interface AvatarOptions {
  chars: number;
  size: number;
}

export function createAvatar(seed: string, options: AvatarOptions) {
  console.log(`creating avatar with ${seed} and ${options}`);

  const size = options.size || 256;
  const chars = options.chars || 1;
  const fontSize = Math.floor((size / 256) * 130);
  const backgroundColors: string[] = BACKGROUND_COLORS;

  const random = new Random(seed);
  const backgroundColor = random.pickone(backgroundColors);
  const seedInitials = (initials(random.seed.trim()) as string)
    .toLocaleUpperCase()
    .slice(0, chars);

  return [
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" version="1.1" `,
    `xmlns="http://www.w3.org/2000/svg"><g><rect fill="${backgroundColor}" width="${size}" `,
    `height="${size}" y="0" x="0"/><text x="50%" y="50%" alignment-baseline="middle" `,
    'dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="SF Display" ',
    `font-weight="400" font-size="${fontSize}px" dy=".35em">${seedInitials}</text></g></svg>`,
  ].join('');
}

export async function output(svg: string, outputFormat: string) {
  console.log(`outputting: ${svg} to ${outputFormat}`);

  const buffer = await sharp(Buffer.from(svg))
    .toFormat(outputFormat)
    .toBuffer();

  return buffer;
}

export async function upload(bucket: string, key: string, buffer: Buffer) {
  console.log(`upload: ${key} to ${bucket}`);

  const { uploaded } = uploadBuffer(bucket, key, buffer);

  await uploaded;
}
