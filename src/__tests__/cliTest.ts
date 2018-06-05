/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from "fs-extra";
import * as path from "path";
import { directory } from "tempy";
import { createPackageJson, generateModule, IPackageJson } from "../index";

describe("module generation", () => {
    let output: string;

    beforeEach(() => {
        output = directory();
    });

    it("generates correct module", () => {
        const packageName = "somePackage";
        const version = "1.0.0";
        generateModule(packageName, version, "commonjs", output);

        expect(fs.existsSync(path.join(output, "package.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(output, "tsconfig.json"))).toBeTruthy();
        expect(fs.readJSONSync(path.join(output, "tsconfig.json")).compilerOptions.module).toEqual("commonjs");
    });

    it("generates correct packageJson", () => {
        const inputPackage: IPackageJson = {
            dependencies: { "conjure-client": "1.0.0" },
            devDependencies: { typescript: "2.7.2" },
        };
        // tslint:disable:object-literal-sort-keys
        expect(createPackageJson(inputPackage, "foo", "1.0.0")).toEqual({
            name: "foo",
            version: "1.0.0",
            sideEffects: false,
            scripts: {
                build: "tsc",
            },
            peerDependencies: { "conjure-client": "1.0.0" },
            devDependencies: {
                "conjure-client": "1.0.0",
                typescript: "2.7.2",
            },
            author: "Conjure",
            license: "UNLICENSED",
        });
        // tslint:enable:object-literal-sort-keys
    });
});