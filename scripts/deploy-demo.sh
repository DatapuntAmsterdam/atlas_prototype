echo -n "To which demo server do you want to deploy? (valid options are 1, 2 and 3): "
read SEVER_NUMBER

if [[ $SEVER_NUMBER -lt 0 || $SEVER_NUMBER -gt 3 ]]
 then
  echo "Input outside acceptable range."
  exit 1
fi

SOURCE_BRANCH=$(git branch --show-current)
TARGET_BRANCH="demo$SEVER_NUMBER"

echo "Pushing $SOURCE_BRANCH to $TARGET_BRANCH."

git branch -D $TARGET_BRANCH
git checkout -b $TARGET_BRANCH

git push --no-verify --force --set-upstream origin $TARGET_BRANCH
git checkout $SOURCE_BRANCH

echo "Done. Your branch will be deployed to https://demo$SEVER_NUMBER.data.amsterdam.nl soon."
