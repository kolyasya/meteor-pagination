# How to Publish kolyasya:meteor-pagination

## Step 1: Login to Meteor
Make sure you are logged in to your Meteor account in the terminal:
```bash
meteor login
```

## Step 2: Go to Package Directory
You must run the publish command from the directory containing `package.js`:
```bash
cd example/packages/meteor-pagination
```

## Step 3: Publish
Run the publish command:
```bash
meteor publish
```

*Note: Meteor handles beta/prerelease versions automatically. Since the version in `package.js` is set to `1.0.0-beta.12`, Atmosphere registers it as a beta package.*
