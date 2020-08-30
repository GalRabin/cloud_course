from dataclasses import dataclass


@dataclass
class Python:
    v_2_7: bool = False
    v_3_3: bool = False
    v_3_4: bool = False
    v_3_5: bool = False
    v_3_6: bool = False
    v_3_7: bool = False
    v_3_8: bool = False

    def make_list(self):
        versions = []
        if self.v_2_7:
            versions.append("2.7.17")
        if self.v_3_3:
            versions.append("3.3.7")
        if self.v_3_4:
            versions.append("3.4.10")
        if self.v_3_5:
            versions.append("3.5.9")
        if self.v_3_6:
            versions.append("3.6.11")
        if self.v_3_7:
            versions.append("3.7.8")
        if self.v_3_8:
            versions.append("3.8.5")

        return versions
