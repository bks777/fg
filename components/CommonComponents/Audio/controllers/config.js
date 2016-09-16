let config = {
    "combinations": [ //"amount", "line", "occurrences", "symbol"
        {
            condition: "occurrences >= 3 && symbol == 1",
            exec: ["play", ["el_10","sound_1"]]
        },
        {
            condition: "occurrences >= 3 && symbol == 2",
            exec: ["play", ["el_J","sound_1"]]
        },
        {
            condition: "occurrences >= 3 && symbol == 3",
            exec: ["play", ["el_Q","sound_1"]]
        },
        {
            condition: "occurrences >= 3 && symbol == 4",
            exec: ["play", ["el_K","sound_2"]]
        },
        {
            condition: "occurrences >= 3 && symbol == 5",
            exec: ["play", ["el_A","sound_2"]]
        },
        {
            condition: "occurrences >= 3 && symbol == 6",
            exec: ["play", ["el_scorpion","sound_3"]]
        },
        {
            condition: "occurrences >= 3 && symbol == 7",
            exec: ["play", ["el_cobra","sound_4"]]
        },
        {
            condition: "occurrences >= 2 && symbol == 8",
            exec: ["play", ["el_black_cat","sound_5"]]
        },
        {
            condition: "occurrences >= 2 && symbol == 9",
            exec: ["play", ["el_Nefertiti","sound_6"]]
        },
        {
            condition: "occurrences >= 2 && symbol == 10",
            exec: ["play", ["el_wild_pharaon_silmple","sound_7"]]
        },
        {
            condition: "occurrences >= 2 && symbol == 11",
            exec: ["play", ["el_wild_pharaon_red","sound_8"]]
        },
        {
            condition: "occurrences >= 2 && symbol == 12",
            exec: ["play", ["el_wild_pharaon_gold","sound_9"]]
        },
        {
            condition: "occurrences >= 2 && symbol == 13",
            exec: ["play", ["el_scatter","sound_10"]]
        },
        {
            condition: "occurrences >= 2 && symbol == 14",
            exec: ["play", ["el_bonus","sound_11"]]
        }
    ]

};

export default config;