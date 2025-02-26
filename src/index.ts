import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync, readdirSync, readFileSync } from 'fs';
import path from 'path';
import cliProgress from 'cli-progress';

export default function clearCache(): void {
  const npmCacheDirectory = execSync('npm config get cache').toString().trimEnd();
  const npxCacheDirectory = path.join(npmCacheDirectory, '_npx');

  // create a new progress bar instance and use shades_classic theme
  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  console.log('Starting cleaning ... \n');

  if (existsSync(npxCacheDirectory)) {
    const subdirectoryNames = readdirSync(npxCacheDirectory);
    const subdirectories = subdirectoryNames.map((subdirectoryName) =>
      path.join(npxCacheDirectory, subdirectoryName),
    );

    // start the progress bar with a total value of 200 and start value of 0
    bar1.start(subdirectories.length, 0);

    for (let i = 0; i < subdirectories.length; i += 1) {
      const subdirectory = subdirectories[i];
      const packagePath = path.join(subdirectory, 'package.json');

      // update the current value in your application..
      bar1.update(i + 1);

      if (existsSync(packagePath)) {
        const package_json = JSON.parse(readFileSync(packagePath).toString());

        if (package_json.name === 'clear-npx-cache') continue;
      }

      rmSync(subdirectory, { recursive: true });
    }

    // stop the progress bar
    bar1.stop();

    console.log('\n Cache cleared successfully! Thanks for using our lib.');
  } else {
    mkdirSync(npxCacheDirectory);
    console.log('\n Everything up to date, cache already clean!');
  }
}