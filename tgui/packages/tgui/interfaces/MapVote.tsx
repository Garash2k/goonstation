/**
 * @file
 * @copyright 2024
 * @author Garash2k (https://github.com/Garash2k)
 * @license ISC
 */

import { Window } from '../layouts';
import { useBackend } from '../backend';
import { Box, Button, Dimmer, Image, Section, Stack, Tooltip } from '../components';
import type { InfernoNode } from 'inferno';
import { computeBoxProps } from '../components/Box';

interface MapVoteMapDetials {
  description: string,
  location: string,
  engine: string,
  mining: string,
  idealPlayers: string
}

export interface MapVoteMapData {
  name: string,
  thumbnail: string,
  details: MapVoteMapDetials
}

export interface MapVoteData {
  playersVoting: boolean,
  mapList: Array<MapVoteMapData>,
  clientVoteMap: any,
}

export const MAP_PANEL_WIDTH = 150;
export const SPACE_BETWEEN_PANELS = 5;
export const WINDOW_HOZ_PADDING = 12;
export const PANEL_PER_LINE = 4;

const BASE_HEIGHT = 100;
export const MAP_ROW_HEIGHT = 130;

export const MapVote = (_props, context) => {
  const { data, act } = useBackend<MapVoteData>(context);
  const { playersVoting, mapList, clientVoteMap } = data;

  const height = BASE_HEIGHT + MAP_ROW_HEIGHT * Math.ceil(mapList.length / PANEL_PER_LINE);
  const width = (MAP_PANEL_WIDTH + SPACE_BETWEEN_PANELS) * PANEL_PER_LINE + WINDOW_HOZ_PADDING;

  return (
    <Window height={height} width={width}>
      <Window.Content>
        <Stack wrap justify="space-around">
          {mapList.map(map => (
            <MapPanel
              key={map.name}
              mapName={map.name}
              mapThumbnail={map.thumbnail}
              button={
                <Button.Checkbox
                  checked={clientVoteMap[map.name]}
                  color={clientVoteMap[map.name] ? "green" : "red"}
                  tooltip="Vote" />
              }
              onClick={() => act('toggle_vote', { map_name: map.name })}
              style={{ cursor: "pointer" }}
              voted={!!clientVoteMap[map.name]}
              details={map.details}
            />
          ))}
        </Stack>
        <Section
          title="All"
          mt={1}
          buttons={
            <>
              <Button.Checkbox
                checked
                color="green"
                onClick={() => act('all_yes')}>
                Vote Yes to All
              </Button.Checkbox>
              <Button.Checkbox
                color="red"
                onClick={() => act('all_no')}
                ml={1}>
                Vote No to All
              </Button.Checkbox>
            </>
          } />
        {!playersVoting && (<Dimmer fontSize={1.5}>Map Vote has ended</Dimmer>)}
      </Window.Content>
    </Window>
  );
};

interface MapPanelProps {
  mapName: string,
  voted?: boolean,
  won?: boolean,
  button?: InfernoNode,
  onClick?: () => void,
  style?: Record<string, string>,
  mapThumbnail: string,
  children?: InfernoNode,
  details: MapVoteMapDetials | null
}

export const MapPanel = (props: MapPanelProps) => {
  const {
    mapName,
    button,
    mapThumbnail,
    children,
    details,
    voted,
    won,
    ...rest
  } = props;

  const panel = (
    <Section
      title={(
        <Box inline nowrap overflow="hidden"
          style={{ "text-overflow": "ellipsis" }}
          maxWidth={`${MAP_PANEL_WIDTH - 35}px`}>
          {mapName}
        </Box>)}
      className={`MapPanel ${voted ? "MapPanel--voted" : ""} ${won ? "MapPanel--won" : ""}`}
      buttons={button}
      width={`${MAP_PANEL_WIDTH}px`}
      align={button ? null : "center"}
      mb={1}
      {...computeBoxProps(rest)}
    >
      <Box align="center">
        <Image src={mapThumbnail} backgroundColor="#0f0f0f" width="75px" />
      </Box>
      {children}
    </Section>
  );

  return (
    <Stack.Item>
      {details
        ? <Tooltip content={<MapPanelTooltip mapName={mapName} details={details} />}>{panel}</Tooltip>
        : panel}
    </Stack.Item>
  );
};

interface MapPanelTooltipProps {
  mapName: string,
  details: MapVoteMapDetials
}

const MapPanelTooltip = (props: MapPanelTooltipProps) => {
  const { mapName, details } = props;
  return (
    <>
      <strong>{mapName}</strong><br />
      {details.description}<br />
      <strong>Location:</strong> {details.description}<br />
      <strong>Engine:</strong> {details.engine}<br />
      <strong>Mining:</strong> {details.mining}<br />
      <strong>Ideal Players:</strong> {details.idealPlayers}<br />
    </>
  );
};
