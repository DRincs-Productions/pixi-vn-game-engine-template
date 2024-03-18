import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, CssVarsProvider, Input, Sheet, Stack, Typography } from "@mui/joy";
import Avatar from '@mui/joy/Avatar';
import { CharacterModelBase } from "../lib/classes/CharacterModelBase";
import { getCharacterByTag } from "../lib/decorators/CharacterDecorator";
import { getDialogueHistory } from "../lib/functions/DialogueUtility";

export default function HistoryInterface() {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <Sheet
                component="main"
                sx={{
                    height: "100%",
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "auto",
                    gridTemplateRows: "auto 1fr auto",
                    pointerEvents: "auto",
                }}
            >
                <Stack
                    sx={{
                        px: 2,
                        py: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Stack sx={{ mb: 2 }}>
                        <Typography level="h2">History</Typography>
                    </Stack>
                    <Input
                        placeholder="Search"
                        value={""}
                        startDecorator={<SearchRoundedIcon />}
                        aria-label="Search"
                    />
                </Stack>
                <Stack
                    spacing={2}
                    sx={{
                        px: 2,
                        py: 2,
                        minHeight: 0
                    }}>
                    <Stack spacing={2} sx={{ overflow: "auto" }}>
                        {getDialogueHistory().map((dialogue, index) => {
                            let character = dialogue.characterTag ? getCharacterByTag(dialogue.characterTag) ?? new CharacterModelBase(dialogue.characterTag, { name: dialogue.characterTag }) : undefined
                            return <Stack
                                direction="row"
                                spacing={1.5}
                                key={index}
                            >
                                <Avatar
                                    size="sm"
                                    src={character?.icon}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography level="title-sm">{character?.name}</Typography>
                                    <Typography level="body-sm">{dialogue.text}</Typography>
                                </Box>
                            </Stack>
                        })}
                    </Stack>
                </Stack>
            </Sheet>
        </CssVarsProvider>
    );
}
