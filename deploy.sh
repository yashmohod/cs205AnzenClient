echo "Warning:"
echo "Please make sure the production settings are on before deploying!!!"

# echo "Switching to master branch"
# git checkout master

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* ymohod@campus@anzen:/home/ymohod@campus.ithaca.lan/Desktop/client/build



echo "Done!"
