sls config credentials \
  --provider aws \
  --key ${SLS_KEY} \
  --secret ${SLS_SECRET} \
  --profile ${PROFILE}

echo 'Deploying'
sls deploy -s ${STAGE}
