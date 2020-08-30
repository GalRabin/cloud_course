from dataclasses import dataclass


@dataclass
class GoLang:
    v_1_1_0: bool = False
    v_1_1_1: bool = False
    v_1_1_2: bool = False
    v_1_1_3: bool = False

    def make_list(self):
        versions = []
        if self.v_1_1_0:
            versions.append("1.10.8")
        if self.v_1_1_1:
            versions.append("1.11.13")
        if self.v_1_1_2:
            versions.append("1.12.17")
        if self.v_1_1_3:
            versions.append("1.13.8")

        return versions
