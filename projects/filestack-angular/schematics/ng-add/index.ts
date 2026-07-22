import { join, normalize } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addRootProvider } from '@schematics/angular/utility';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { Schema } from './schema';

// filestack-js is a peerDependency of @filestack/angular. Keep this in sync with
// the peerDependencies range in package.json so `ng add` writes a matching
// dependency into the consumer app; npm then resolves to the newest satisfying
// version (currently the latest 4.x).
const FILESTACK_JS_VERSION = '>=3.47.4 <5.0.0';

/**
 * `ng add @filestack/angular` schematic.
 *
 * - Installs `filestack-js` (a runtime dependency of the library).
 * - Registers `provideFilestack({ apikey })` in the application's root providers.
 *   `addRootProvider` transparently supports both standalone apps (`app.config.ts`)
 *   and NgModule apps (`app.module.ts`), and `provideFilestack` is the non-deprecated
 *   replacement for `FilestackModule.forRoot()`.
 * - Optionally appends a sample picker usage snippet to the root template.
 */
export function ngAdd(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const projectName = options.project || getDefaultProjectName(workspace);

    if (!projectName || !workspace.projects.has(projectName)) {
      throw new SchematicsException(
        'Could not determine the target Angular project. Re-run with --project=<name>.'
      );
    }

    // 1. Ensure filestack-js (runtime dependency) is present in package.json.
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: 'filestack-js',
      version: FILESTACK_JS_VERSION,
      overwrite: false,
    });
    context.addTask(new NodePackageInstallTask());

    // 2. Wire provideFilestack({ apikey }) into the root providers.
    const apikey = (options.apikey || '').trim();
    const rules: Rule[] = [
      addRootProvider(projectName, ({ code, external }) =>
        code`${external('provideFilestack', '@filestack/angular')}({ apikey: ${JSON.stringify(apikey)} })`
      ),
    ];

    // 3. Optionally drop a usage snippet into the root template.
    if (options.addSample) {
      rules.push(addSampleSnippet(projectName));
    }

    context.logger.info(
      '✔ Added provideFilestack() to your application. ' +
        (apikey
          ? 'Your API key has been configured.'
          : 'Remember to set your Filestack API key in provideFilestack({ apikey }).')
    );

    return chain(rules);
  };
}

/** Picks the first `application`-type project, falling back to the first project. */
function getDefaultProjectName(workspace: Awaited<ReturnType<typeof getWorkspace>>): string | undefined {
  for (const [name, project] of workspace.projects) {
    if (project.extensions['projectType'] === 'application') {
      return name;
    }
  }
  return workspace.projects.keys().next().value;
}

/**
 * Appends a commented sample `<ng-picker-overlay>` usage block to the project's
 * root component template (best-effort; a comment never breaks the build).
 */
function addSampleSnippet(projectName: string): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get(projectName);
    const sourceRoot = project?.sourceRoot ?? join(normalize(project?.root ?? ''), 'src');
    const templatePath = join(normalize(sourceRoot), 'app', 'app.component.html');

    if (!tree.exists(templatePath)) {
      context.logger.info(
        'Skipped sample snippet: could not locate app/app.component.html. ' +
          'Add <ng-picker-overlay></ng-picker-overlay> to any template to use the picker.'
      );
      return;
    }

    const snippet =
      '\n<!-- Filestack sample picker (uncomment and import PickerOverlayComponent to use):\n' +
      '<ng-picker-overlay (uploadSuccess)="onUpload($event)">\n' +
      '  <button>Upload with Filestack</button>\n' +
      '</ng-picker-overlay>\n' +
      '-->\n';

    const recorder = tree.beginUpdate(templatePath);
    recorder.insertRight(tree.read(templatePath)!.length, snippet);
    tree.commitUpdate(recorder);
    context.logger.info('Added a sample Filestack picker snippet to app.component.html.');
  };
}
