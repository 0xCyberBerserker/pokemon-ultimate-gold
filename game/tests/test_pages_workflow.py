from pathlib import Path
import re
import unittest


class PagesWorkflowTests(unittest.TestCase):
    def test_manual_pages_build_includes_react_and_preserves_deployment_gates(self):
        path = Path(__file__).resolve().parents[2] / ".github/workflows/game-pages.yml"
        workflow = path.read_text(encoding="utf-8")
        self.assertRegex(workflow, r"(?m)^  workflow_dispatch:\s*$")
        self.assertNotRegex(workflow, r"(?m)^  (?:push|pull_request|schedule):")
        self.assertIn("pnpm install --frozen-lockfile --ignore-scripts", workflow)
        self.assertIn("pnpm test", workflow)
        self.assertIn("pnpm build", workflow)
        self.assertIn("python3 tools/build_site.py --react-dist wiki-frontend/dist", workflow)
        self.assertIn("node --test checks/production-http.test.mjs", workflow)
        self.assertIn('PUG_INTEGRATED: "1"', workflow)
        self.assertLess(workflow.index("pnpm build"), workflow.index("python3 tools/build_site.py --react-dist"))
        self.assertLess(workflow.index("python3 tools/build_site.py --react-dist"), workflow.index("pnpm test"))
        self.assertLess(workflow.index("pnpm test"), workflow.index("node --test checks/production-http.test.mjs"))
        self.assertIn("metadata.get(\"visibility\") != \"public\"", workflow)
        self.assertIn("os.environ[\"GITHUB_REF\"] != f\"refs/heads/{default_branch}\"", workflow)
        uses = re.findall(r"(?m)^\s*-?\s*uses:\s*([^\s]+)", workflow)
        self.assertTrue(uses)
        self.assertTrue(all(re.search(r"@[0-9a-f]{40}$", action) for action in uses), uses)


if __name__ == "__main__":
    unittest.main()
