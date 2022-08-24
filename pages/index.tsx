import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";

class Racer {
  speed = 0;
  position = 0;
  constructor(public name: string) {
    makeAutoObservable(this);
  }
  setSpeed(speed: number) {
    this.speed = speed;
  }
}

class Race {
  framesPassed = 0;
  constructor(public racers: Racer[]) {}

  increaseTimer() {
    this.framesPassed += 1;

    this.racers.forEach((player) => {
      player.position += player.speed;
    });
  }

  adjustSpeed() {
    this.racers.forEach((player) => {
      player.speed = getRandomArbitrary(0.1, 0.5);
    });
  }
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const RaceTrack = observer(({ race }: { race: Race }) => {
  return (
    <>
      {race.racers.map((player) => (
        <div
          className=""
          key={player.name}
          style={{ marginLeft: `${player.position}%` }}
        >
          {player.name}
        </div>
      ))}
    </>
  );
});

const race = new Race([
  new Racer("Brodie"),
  new Racer("James"),
  new Racer("Chris"),
  new Racer("Colin"),
  new Racer("Ernesto"),
  new Racer("Mike"),
  new Racer("Chad"),
  new Racer("Dave"),
  new Racer("Andrew M"),
  new Racer("Andrew B"),
  new Racer("Ryan"),
  new Racer("Josh"),
]);

const Home: NextPage = () => {
  useEffect(() => {
    setInterval(() => {
      race.increaseTimer();
    }, 50);

    setInterval(() => {
      race.adjustSpeed();
    }, 1000);
  }, []);

  return (
    <div className="w-screen h-screen bg-green-300 relative">
      <main>
        <RaceTrack race={race} />
      </main>
    </div>
  );
};

export default Home;
