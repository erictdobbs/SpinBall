

var levels: Level[] = [];


function loadLevels(): void {

    levels.push(new Level(0, `
     #########
     #       #
     # x     #
     ##◣g#   #
          ggg 
`, false));

    levels.push(new Level(1, `
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
`, false));

    levels.push(new Level(4, `
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
`, true));

    levels.push(new Level(3, `
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
`, true));

    levels.push(new Level(5, `
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
`, false));

    levels.push(new Level(2, `
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
`, true));

    levels.push(new Level(1, `
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
`, true));

    levels.push(new Level(3, `
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
`, true));

    levels.push(new Level(2, `
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
`, true));

    levels.push(new Level(3, `
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
`, true));

    levels.push(new Level(3, `
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
`, true));

    levels.push(new Level(4, `
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
`, false));

    levels.push(new Level(5, `
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
`, false));

    levels.push(new Level(3, `
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
`, true));

    levels.push(new Level(4, `
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
`, true));

    levels.push(new Level(1, `
#########
#       # ############# ############
#       # #          o# #          #
# x #   # #           # #          #
#####   # #           # #          #
    #   # #    ###    ###   ####   #
    #   ###    # #          # #g   #
    #          # #          # #g   #
    #          # #         o# #g   #
    #         o# ############ #g   #
    ############              ######
`, true));


//…:.+
//┌┐└┘
//◟◞◜◝
//◢◣◥◤

}