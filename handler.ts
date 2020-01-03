// eslint-disable-next-line import/no-unresolved, no-unused-vars
import { Context, Callback } from 'aws-lambda';
import { successResponse, runWarm } from './src/utils';
import { createAvatar, output, upload } from './src/initials';
import { getDestinationBucket } from './src/env';

process.env.FONTCONFIG_PATH = '/var/task/fonts';

const mime = require('mime/lite');

interface InitialsLambdaEvent {
  seed: string;
  filePath: string;
}

const main: Function = async (event: InitialsLambdaEvent,
  _context: Context,
  // eslint-disable-next-line consistent-return
  callback: Callback) => {
  // https://stackoverflow.com/q/56188864/2015025
  // Lambda is standalone service that doesn't need to be integrated with API
  // Gateway.queryStringParameters, body, body mapping templates, all of this is
  // specific not to Lambda, but to Lambda - API Gateway integration.
  const { seed, filePath } = event;
  console.log(`event: ${seed}, filePath: ${filePath}`);

  try {
    const outputFormat = mime.getExtension(mime.getType(filePath));

    const svg = createAvatar(seed, {
      chars: 1,
      size: 256,
    });
    const buffer = await output(svg, outputFormat);
    await upload(getDestinationBucket(), filePath, buffer);

    // successResponse handles wrapping the response in an API Gateway friendly
    // format (see other responses, including CORS, in `./utils/lambda-response.js)
    return successResponse({
      message: filePath,
    });
  } catch (error) {
    callback(error);
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(main);
