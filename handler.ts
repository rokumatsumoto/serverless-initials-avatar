import { successResponse, runWarm } from './src/utils';
import { avatarInitials, svgToOutputBuffer } from './src/initials';

process.env.FONTCONFIG_PATH = '/var/task/fonts';

const mime = require('mime/lite');

interface InitialsLambdaEvent {
  seed: string;
}

const main: Function = async (event: InitialsLambdaEvent) => {
  // successResponse handles wrapping the response in an API Gateway friendly
  // format (see other responses, including CORS, in `./utils/lambda-response.js)
  const response = successResponse({
    message: 'Go Serverless! Your function executed successfully!',
    input: event,
  });

  // https://stackoverflow.com/q/56188864/2015025
  // Lambda is standalone service that doesn't need to be integrated with API
  // Gateway.queryStringParameters, body, body mapping templates, all of this is
  // specific not to Lambda, but to Lambda - API Gateway integration.
  const { seed } = event;
  console.log(`event: ${seed}`);

  const extension = mime.getExtension('image/png');

  const svg = avatarInitials(seed, {
    chars: 1,
  });
  await svgToOutputBuffer(svg, extension);
  // const buffer = await svgToOutputBuffer(svg, extension);
  // await upload(buffer, extension);
  console.log('done');

  return response;
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(main);
