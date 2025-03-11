let inherit (import <nixpkgs> {}) fetchFromGitHub mkShellNoCC cacert git; in

let fetchNixpkgs =
  { rev, sha256 ? "" }: import (fetchFromGitHub { owner = "NixOS"; repo = "nixpkgs"; inherit rev sha256; }) {}; in

let inherit (fetchNixpkgs {
  rev = "ebe2788eafd539477f83775ef93c3c7e244421d3"; # 24.11 2025/03/11
  sha256 = "yfDy6chHcM7pXpMF4wycuuV+ILSTG486Z/vLx/Bdi6Y=";
}) nodejs_22 pnpm_10; in

mkShellNoCC { packages = [ cacert git nodejs_22 pnpm_10 ]; }
