

var levels: Level[] = [];


function loadLevels(): void {
    levels = [];
    levels.push(new Level(6, 30, `q
     #########
     #     BB#
     # x     #
     ###g#   #
          ggg 
`));

///////////////////////////////////////
// PRACTICE MODE
///////////////////////////////////////

    levels.push(new Level(1, 45, `
##############
#            #
#            #
#    ####    #
# x  #  #gggg#
##############
`, "Rotate the maze with Left and Right."));

    levels.push(new Level(1, 30, `
##############
#            #
#            #
# x          # ######
##########   # #gggg#
         #   # #    #
         #   # #    #
     #####   # #    #
     #       # ###  #
     #       # #    #
     #       # #    #
######   ##### #    #
#        #     #  ###
#        #     #    #
#        #    #◤    #
#    #####   #◤     #
#    #      #◤     ◢#
#    #######◤     ◢#
#                ◢#
#               ◢#
#              ◢#
################
`, "Navigate to the end of each maze before time runs out."));

    levels.push(new Level(1, 30, `q
     #########
     #       #
     # x     #
     #####   #######
     #             #
     #             #
######  ◥#######◤  ######
#                       #
#        #  g  #        #
#  #######  g  #######  #
#                       #
#         ◢###◣         #
#########################
`, "Some mazes can't be completely rotated."));

    levels.push(new Level(1, 30, `
#########
#       # ############# ############
#       # #          o# #          #
# x #   # #     .     # #          #
#####   # #           # #          #
    #   # #    ###    ###   ####   #
    #   ###    # #          # #g   #
    #          # #     .    # #g   #
    #    .     # #         o# #g   #
    #         o# ############ #g   #
    ############              ######
`, "Round bumpers and pins will bounce the marble around."));

    levels.push(new Level(1, 30, `
#######
#_____#########
# ____________#
# _# _#_______#
# _#NN#####_x_#
#__#__#N#N#####
# ____##N##g__#
# ____#N#N#g__#
####__#######_#
#_____#_____N_#
#_____#_____N_#
#__#NN#__#__#_#
#________N____#
#________N____#
###############
`, "Red blocks will run out your timer faster. Don't touch them!"));

levels.push(new Level(1, 30, `
##############gg#
#______#_____#mm#
#______#_____#mm#
#___#__#mm#__#mm#
#___#__#BB#__#mm#
#___#__#__#__#mm#
#___#__#__#__#__#
#_x_#mm#__#__#__#
#####__#__#_____#
____#_____#P____#
____#_____#PP___#
____#############
`, "Small blocks can be broken with enough speed."));

///////////////////////////////////////
// EASY MODE
///////////////////////////////////////

    levels.push(new Level(2, 60, `
         #################
         #################
###########            ◝##
###########             ##
##       ##    #####    ##
## x           #####    ##
##    ##       ##       ##
###########    ##      ◞##
#################  #######
##              #  #######
##              #  ##
##  ####### .. ##  ##
##  ####### .. ##  ##◣
##  #######◣  ◢##  ◥##◣
##   #######gg###◣  ◥##◣
##      ##########◣  ◥##◣
##  . .   #####  ##◣  ◥###
##     .  ◥##     ◥#◣  ◥##
##### .  . ##      ◥#◣  ##
 #####◣    ##  ##◣  ◥#  ##
  #####◣   ##  ###◣     ##
   ######  ##  ####◣   ◢##
    #####  ##  ###########
     ####  ##mm##
      ###      ##
       ##      ##
        #########
`));

levels.push(new Level(2, 30, `
################
##◤______#_____#
#◤_______#_◣_◢_#
# _______#_#g#_#
# _###_#B#_###_#
#  _#___##_____#
# __#___##_____#
#  _#_x_##_____#
#…__######B#___#
# __#◜___##◤___#
# __#____#◤___◢#
#___#_#______◢##
#◣____#_____◢###
##◣__◞#__o_◢####
################
`));

levels.push(new Level(2, 30, `
#################
#◜   >  :  <   ◝#
#    >  :  <    #
#  ####◣ ◢##.  .#
#    ##ggg## .  #
###  #######    #
#    #◜ x ◝#  . #
#    # ### #  . #
#    #◟   ◞#.   #
#  ##### ###   .#
#    #◜   ◝# . .#
###  #  o  #  . #
#    #◟   ◞# .  #
#  ##### #####  #
#     <   >     #
#################
`));

levels.push(new Level(2, 40, `
#################
#◜_____◝#◜_____◝#
# #####_#_#####_#
#◟___◝#_#_#◜___◞#
#####_#_#_#_#####
#◜  _◞#◟_◞#_#◜_◝#
# #########_#_#_#
#◟ ◝#___#BB_#_#_#
### #_x_#BB_#_#_#
#◜ ◞#◣_◢###_#_#_#
#◟◝###_#◜__◞#_#_#
#◜◞#g#_#_####_#_#
#◟◝#g#_#◟____◞#_#
#◜◞#_#_########_#
#◟  ◞#◟________◞#
#################
`));

levels.push(new Level(2, 30, `
##################
#x   ◥◣    ◢◤    #
###◣  ◥◣  ◢◤  .  #
#g ◥◣  ◥◣◢◤  ◢◤  #
#g  ◥◣  ◥◤  ◢◤  ◢#
#◢◣  ◥◣    ◢◤  ◢◤#
#◥◤◢◣ ◥◣  ◢◤  ◢◤ #
#  ◥◤◢◣◥◣◢◤. ◢◤  #
#  ◢◣◥◤◢◤◥◣. ◥◣  #
#◢◣◥◤ ◢◤..◥◣  ◥◣ #
#◥◤  ◢◤    ◥◣  ◥◣#
#   ◢◤  ◢◣  ◥◣  ◥#
#  ◢◤  ◢◤◥◣  ◥◣  #
#  .  ◢◤  ◥◣  .  #
#    ◢◤    ◥◣    #
##################
`));

levels.push(new Level(2, 30, `
◢#########◣
#+ _g##◤__◥◣
# +_g#◤__._#####◣
#  +#◤____◢◤.___◥◣
#  ◢◤_◢#_#◤___#◣_◥◣
#  #__#____◢#◣_◥◣_#
#  #__#_.__#_#__#_◥◣
#  ◥◣_◥◣___◥#◤_◢◤__#
#  _◥◣_◥##◣___◢◤__◢◤
#  _+◥◣___#◣.◢◤_:◢◤
#  +__#_x_###◤…_◢◤
# +_  ◥###◤____◢◤
#+ __ _______:◢◤
◥#############◤
`));

///////////////////////////////////////
// NORMAL MODE
///////////////////////////////////////

    levels.push(new Level(3, 30, `
##########################
##########################
##◜        ◥###        ◝##
##          ◥##         ##
##      #◣        ###   ##
##      ◥#◣       ##    ##
#####    ###########    ##
#####    ###########   ###
##       ##       ##   ###
##       ##       ##    ##
##   o##### x ##  ##    ##
##    ##########  ####  ##
##mmmm##    ###    ###gg##
##    ##    ####  ########
##    ##  #####    #######
##o   ##  ######  ########
##    ##  ######       ◝##
##    ##      ##◣       ##
##    ##      ###### o  ##
##        ##            ##
##       ◢##◟          ◞##
##########################
##########################
`));

    levels.push(new Level(3, 30, `
#####################
#                   #
# x          #     ◢#
##########^^^####  ##
#g       #^^^      ◥#
#g       #          #
#g       #   ########
#####……  #   <<<<<<<#
#        #   <<<<<<<#
#        #   #      #
#....#####   #      #
#    >>>>>          #
#    >>>>>    o    o#
#    #########      #
#◣                 ◢#
##◣               ◢##
#####################
`));

    levels.push(new Level(3, 30, `
#############################
##◤                 o       #
#◤     ◢◣     o             #
#     ◢◤◥◣                  #
#     ◥◣◢################   #
#      ◥#◤    . : . : .     #
# o     #                  ◢#
#       #     . : . : .   ◢##
#   o   #     ###############
#       #   ◢◣  ◢◣  ◢◣   #gg#
#…     …#   ◥◤  ◥◤  ◥◤   #  #
#       # ◢◣  ◢◣  ◢◣  ◢◣ #  #
#  #o#  # ◥◤  ◥◤  ◥◤  ◥◤ #. #
#  # #  #   ◢◣  ◢◣  ◢◣   #  #
#  #x#  #   ◥◤  ◥◤  ◥◤   # .#
#  #m#  # ◢◣  ◢◣  ◢◣  ◢◣    #
#       # ◥◤  ◥◤  ◥◤  ◥◤    #
#############################
`));

    levels.push(new Level(3, 30, `
##################
#          ◝#gggg#
# x         #o   #
##########  #    #
#◜      ◝#  #   ◥#
#        #  #    #
#  o  o  #  #◤   #
#  #  #     #    #
#◟◞#  #◟   ◞#   ◥#
####  #######    #
#◜    #◜   ◝#◤   #
#    ◞#     #    #
#  ####  #  #   ◥#
#        #       #
#◟      ◞#◟     ◞#
##################
`));

///////////////////////////////////////
// HARD MODE
///////////////////////////////////////

    levels.push(new Level(4, 30, `
#######     ############
#o    #     #          #
#     #……………#  ◢ ◣     #
#  #                   #
#   o #……………#  ◥ ◤     #
#    o#     #### #######
### ###        : :
  : :          : :
  : :          : +…………+
  : :          :      :
  # ######     +…………+ :
  #   .  #          : :
  # .  . #………####   : :
  #             #   : :
  # . . .#………#  #   ggg
  #      #   # x#   ggg
  ########   ####   
`));

    levels.push(new Level(4, 30, `
   ###################
   #◜         ##ggggg#
   # ####### ###◝   ◜#
####v##### : : #  o  #
#◜      ◝#     #◝   ◜#
# ## ### #     #  .  #
# ## # # #  x  #◝   ◜#
#◟  ◞# # #######     #
########v##    .     #
    #◜          o    #
    # ## ##    .    ◞#
    # ## #############
    #◟  ◞#
    ######
`));

    levels.push(new Level(4, 30, `q
############################
#     o     o           <  #
#                       <  #
#  ###o#####o############^^#
#  #          :            #
#  #          :           ◞#
#  #  ◢#####◣   ◢###########
#  #◣       ◥###◤         ◥#
#  ##◣                     #
#  # #◣             ◢##◣   #
#  #  #◣  <<<< .   ◢#  #◣  #
#gg######################^^#
#  #        ◥◤        .  ^^#
#                  . . . ^^#
# x  ◢◣        #         ^^#
#############o##############
`));

///////////////////////////////////////
// SPECIAL MODE
///////////////////////////////////////

    levels.push(new Level(5, 60, `q
############################
##########       ###########
#                .         #
# x       ◢◣         .     #
#####^######   ###        ◢#
#####◟<<<<<<<<<###       ◢##
##################  ########
#  . . . . . . . . . . . . #
# . . . . . . . . . . . .  #
#  . . . . . . . . . . . . #
# . . . . . . . . . . . .  #
#  . . . . . . . . . . . . #
# . . . . . . . . . . . .  #
#  . . . . . . . . . . . . #
#  # # # #^# # # # # # # #^#
#  #o#v#v#^# # # #o# # # #^#
#oo###v#v#^#o# #o### #v#v#^#
######v#v#^##◤ ◥#### #v#v#^#
######◟>>>◞##gggggggg#◟>>>◞#
############################
`));

    levels.push(new Level(5, 30, `q
##########################
##########################
##                   <<◝##
##                   << ##
##        ◢#◣        ##^##
##   ◞◟   ◥#◤   ◞◟   ##^##
##    .         .    ##^##
##      ..   ..      ##^##
##  ◞◟     .     ◞◟  ##^##
##        ◢#◣        ##^##
##    .         .    ##^##
##o .    .   .    . o##^##
##     .  <^>  .     ##^##
##   o   <mmm>   o   ##^##
##◣      #ggg#      ◢##^##
###◣  .  ◥###◤  .  ◢###^##
##◤  . .       . .  ◥##^##
##  . o .     . o .  ##^##
## . . . . . . . . . ##^##
##. . . . . . . . . .##^##
#◜  <<< <<< <<< <<< ◢##^##
#  x###################^##
#◟>>>>>>>>>>>>>>>>>>>>>◞##
##########################
##########################
`));

}